import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.js";
import { transporter } from "../src/services/nodemailer.js";
import { connectTestDB, clearTestDB, disconnectTestDB } from "./helpers/db.js";
import { createUser, createVerifiedUser, bearerForUser } from "./helpers/auth.js";

describe("Auth API", () => {
  let sendMailSpy;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    sendMailSpy = jest.spyOn(transporter, "sendMail").mockResolvedValue({ messageId: "test-id" });
  });

  afterEach(() => {
    sendMailSpy.mockRestore();
  });

  it("POST /api/auth/signup creates user", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "Alice",
      email: "alice@example.com",
      password: "Password1",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("alice@example.com");
    expect(sendMailSpy).toHaveBeenCalledTimes(1);
  });

  it("POST /api/auth/signup validates body", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "A",
      email: "invalid",
      password: "weak",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation errors");
  });

  it("POST /api/auth/signin rejects invalid credentials", async () => {
    const response = await request(app).post("/api/auth/signin").send({
      email: "missing@example.com",
      password: "Password1",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/auth/signin blocks unverified account", async () => {
    const user = await createUser({ email: "unverified@example.com", password: "Password1" });

    const response = await request(app).post("/api/auth/signin").send({
      email: user.email,
      password: "Password1",
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("not verified");
  });

  it("POST /api/auth/signin signs in verified account", async () => {
    const user = await createVerifiedUser({ email: "verified@example.com", password: "Password1" });

    const response = await request(app).post("/api/auth/signin").send({
      email: user.email,
      password: "Password1",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
    expect(response.headers["set-cookie"]?.join(";")).toContain("refreshToken=");
  });

  it("GET /api/auth/me requires auth", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("GET /api/auth/me returns current user", async () => {
    const user = await createVerifiedUser();

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", bearerForUser(user));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(user.email);
  });

  it("POST /api/auth/refresh-token requires cookie", async () => {
    const response = await request(app).post("/api/auth/refresh-token");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/auth/refresh-token rotates token", async () => {
    const user = await createVerifiedUser({ email: "rotate@example.com", password: "Password1" });

    const signInResponse = await request(app).post("/api/auth/signin").send({
      email: user.email,
      password: "Password1",
    });

    const cookies = signInResponse.headers["set-cookie"];
    const response = await request(app).post("/api/auth/refresh-token").set("Cookie", cookies);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
    expect(response.headers["set-cookie"]?.join(";")).toContain("refreshToken=");
  });

  it("POST /api/auth/send-verify-otp returns 404 for unknown user", async () => {
    const response = await request(app).post("/api/auth/send-verify-otp").send({
      email: "notfound@example.com",
    });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/auth/verify-email verifies account with valid OTP", async () => {
    const user = await createUser({ email: "otp@example.com" });
    const userWithOtp = await User.findById(user._id).select("+verifyOtp +verifyOtpExpireAt");
    userWithOtp.verifyOtp = "123456";
    userWithOtp.verifyOtpExpireAt = new Date(Date.now() + 60 * 60 * 1000);
    await userWithOtp.save();

    const response = await request(app).post("/api/auth/verify-email").send({
      email: user.email,
      otp: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();

    const updated = await User.findById(user._id).select("+isAccountVerified");
    expect(updated.isAccountVerified).toBe(true);
  });

  it("POST /api/auth/send-reset-code sends code", async () => {
    const user = await createVerifiedUser({ email: "reset-send@example.com" });

    const response = await request(app).post("/api/auth/send-reset-code").send({
      email: user.email,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sendMailSpy).toHaveBeenCalledTimes(1);
  });

  it("POST /api/auth/reset-password rejects invalid OTP", async () => {
    const user = await createVerifiedUser({ email: "reset-invalid@example.com" });

    const userWithOtp = await User.findById(user._id).select("+resetOtp +resetOtpExpireAt");
    userWithOtp.resetOtp = "654321";
    userWithOtp.resetOtpExpireAt = new Date(Date.now() + 15 * 60 * 1000);
    await userWithOtp.save();

    const response = await request(app).post("/api/auth/reset-password").send({
      email: user.email,
      otp: "123456",
      newPassword: "NewPassword1",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/auth/reset-password updates password with valid OTP", async () => {
    const user = await createVerifiedUser({
      email: "reset-valid@example.com",
      password: "OldPassword1",
    });

    const userWithOtp = await User.findById(user._id).select("+resetOtp +resetOtpExpireAt");
    userWithOtp.resetOtp = "654321";
    userWithOtp.resetOtpExpireAt = new Date(Date.now() + 15 * 60 * 1000);
    await userWithOtp.save();

    const resetResponse = await request(app).post("/api/auth/reset-password").send({
      email: user.email,
      otp: "654321",
      newPassword: "NewPassword1",
    });

    expect(resetResponse.status).toBe(200);
    expect(resetResponse.body.success).toBe(true);

    const signInResponse = await request(app).post("/api/auth/signin").send({
      email: user.email,
      password: "NewPassword1",
    });

    expect(signInResponse.status).toBe(200);
    expect(signInResponse.body.success).toBe(true);
  });

  it("POST /api/auth/signout clears refresh cookie", async () => {
    const user = await createVerifiedUser();

    const response = await request(app)
      .post("/api/auth/signout")
      .set("Authorization", bearerForUser(user));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers["set-cookie"]?.join(";")).toContain("refreshToken=");
  });
});
