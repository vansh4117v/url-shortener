import express from "express";
import {
  getUserController,
  logoutController,
  signInController,
  signUpController,
} from "../controllers/auth.controller.js";
import { jwtVerify } from "../middleware/jwtVerify.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signin", authLimiter, signInController);
router.post("/signup", authLimiter, signUpController);
router.get("/me", jwtVerify, getUserController);
router.post("/logout", jwtVerify, logoutController);

export default router;