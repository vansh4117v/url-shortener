import express from "express";
import { urlLimiter } from "../middleware/rateLimiter.js";
import {
  deleteUrlController,
  getAllUrlController,
  getUrlController,
  getUrlInfoController,
  shortenUrlController,
} from "../controllers/url.controller.js";
import { jwtVerifyMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/shorten", jwtVerifyMiddleware, urlLimiter, shortenUrlController);
router.get("/", jwtVerifyMiddleware, getAllUrlController);
router.delete("/:shortId", jwtVerifyMiddleware, deleteUrlController);
router.get("/:shortId/info", jwtVerifyMiddleware, getUrlInfoController);
router.get("/:shortId", getUrlController);

export default router;