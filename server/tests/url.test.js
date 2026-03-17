import request from "supertest";
import app from "../src/app.js";
import Url from "../src/models/url.js";
import { connectTestDB, clearTestDB, disconnectTestDB } from "./helpers/db.js";
import { createVerifiedUser, bearerForUser } from "./helpers/auth.js";

describe("URL API", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it("POST /api/urls/shorten requires auth", async () => {
    const response = await request(app).post("/api/urls/shorten").send({
      longUrl: "https://example.com",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/urls/shorten validates body", async () => {
    const user = await createVerifiedUser();

    const response = await request(app)
      .post("/api/urls/shorten")
      .set("Authorization", bearerForUser(user))
      .send({
        longUrl: "not-a-url",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/urls/shorten creates URL", async () => {
    const user = await createVerifiedUser();

    const response = await request(app)
      .post("/api/urls/shorten")
      .set("Authorization", bearerForUser(user))
      .send({
        longUrl: "https://example.com/page",
        title: "Example Page",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.shortId).toBeTruthy();
  });

  it("POST /api/urls/shorten rejects duplicate custom shortId", async () => {
    const user = await createVerifiedUser();

    await Url.create({
      longUrl: "https://existing.com",
      shortId: "custom123",
      owner: user._id,
    });

    const response = await request(app)
      .post("/api/urls/shorten")
      .set("Authorization", bearerForUser(user))
      .send({
        longUrl: "https://new.com",
        shortId: "custom123",
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it("GET /api/urls returns only current user URLs", async () => {
    const user = await createVerifiedUser({ email: "owner@example.com" });
    const otherUser = await createVerifiedUser({ email: "other@example.com" });

    await Url.create({ longUrl: "https://mine.com", shortId: "mine123", owner: user._id });
    await Url.create({ longUrl: "https://other.com", shortId: "other123", owner: otherUser._id });

    const response = await request(app)
      .get("/api/urls")
      .set("Authorization", bearerForUser(user));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].shortId).toBe("mine123");
  });

  it("GET /api/urls/:shortId returns long URL", async () => {
    const user = await createVerifiedUser();
    await Url.create({
      longUrl: "https://redirect-me.com",
      shortId: "redir01",
      owner: user._id,
    });

    const response = await request(app).get("/api/urls/redir01");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.longUrl).toBe("https://redirect-me.com");
  });

  it("GET /api/urls/:shortId returns 404 when missing", async () => {
    const response = await request(app).get("/api/urls/missing01");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("GET /api/urls/:shortId/info returns details for owner", async () => {
    const user = await createVerifiedUser();
    await Url.create({
      longUrl: "https://info-url.com",
      shortId: "info01",
      owner: user._id,
      title: "Info URL",
    });

    const response = await request(app)
      .get("/api/urls/info01/info")
      .set("Authorization", bearerForUser(user));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.shortId).toBe("info01");
  });

  it("GET /api/urls/:shortId/info blocks non-owner", async () => {
    const owner = await createVerifiedUser({ email: "owner2@example.com" });
    const other = await createVerifiedUser({ email: "other2@example.com" });

    await Url.create({
      longUrl: "https://private-url.com",
      shortId: "priv01",
      owner: owner._id,
    });

    const response = await request(app)
      .get("/api/urls/priv01/info")
      .set("Authorization", bearerForUser(other));

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("DELETE /api/urls/:shortId deletes for owner", async () => {
    const user = await createVerifiedUser();
    await Url.create({
      longUrl: "https://delete-me.com",
      shortId: "del01",
      owner: user._id,
    });

    const response = await request(app)
      .delete("/api/urls/del01")
      .set("Authorization", bearerForUser(user));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const inDb = await Url.findOne({ shortId: "del01" });
    expect(inDb).toBeNull();
  });

  it("DELETE /api/urls/:shortId blocks non-owner", async () => {
    const owner = await createVerifiedUser({ email: "owner3@example.com" });
    const other = await createVerifiedUser({ email: "other3@example.com" });

    await Url.create({
      longUrl: "https://cant-delete.com",
      shortId: "del02",
      owner: owner._id,
    });

    const response = await request(app)
      .delete("/api/urls/del02")
      .set("Authorization", bearerForUser(other));

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
