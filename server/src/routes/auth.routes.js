import express from "express";
import {
  getUserController,
  refreshTokenController,
  resetPasswordController,
  sendPasswordCodeController,
  sendVerifyOtpController,
  signInController,
  signOutController,
  signUpController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import { jwtVerifyMiddleware } from "../middleware/authMiddleware.js";
import { authLimiter, strictLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, signUpController);
router.post("/signin", authLimiter, signInController);
router.post("/signout", jwtVerifyMiddleware, signOutController);
router.post("/refresh-token", authLimiter, refreshTokenController);
router.get("/me", jwtVerifyMiddleware, getUserController);
router.post("/send-verify-otp", authLimiter, sendVerifyOtpController);
router.post("/verify-email", strictLimiter, verifyEmailController);
router.post("/send-reset-code", authLimiter, sendPasswordCodeController);
router.post("/reset-password", strictLimiter, resetPasswordController);
export default router;
