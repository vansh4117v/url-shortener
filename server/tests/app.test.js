import request from "supertest";
import app from "../src/app.js";

describe("Backend app routes", () => {
  it("GET / returns welcome payload", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Welcome to the URL Shortener API",
      version: "1.0.0",
    });
  });

  it("GET /health returns healthy status payload", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
    expect(response.body.environment).toBe("test");
    expect(typeof response.body.timestamp).toBe("string");
    expect(typeof response.body.uptime).toBe("number");
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Not Found");
  });
});
