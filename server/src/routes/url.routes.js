import express from "express";
import { jwtVerify } from "../middleware/jwtVerify.js";
import { urlLimiter } from "../middleware/rateLimiter.js";
import {
  deleteUrlController,
  getAllUrlController,
  getUrlController,
  getUrlInfoController,
  shortenUrlController,
} from "../controllers/url.controller.js";

const router = express.Router();

router.post("/shorten", jwtVerify, urlLimiter, shortenUrlController);
router.get("/", jwtVerify, getAllUrlController);
router.delete("/:shortId", jwtVerify, deleteUrlController);
router.get("/:shortId/info", jwtVerify, getUrlInfoController);
router.get("/:shortId", getUrlController);

export default router;