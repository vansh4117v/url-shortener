import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { config } from "../config/env.js";

const isProduction = config.NODE_ENV === "production";

const defaultHandler = (req, res) => {
  return res.status(429).json({
    error: "Too many requests. Please try again later.",
  });
};

// Use user id when available to limit by account, otherwise fallback to IP
const keyGenerator = (req) => {
  try {
    if (req.user && req.user.id) return `user:${req.user.id}`;
  } catch (err) {
    // ignore
  }
  return ipKeyGenerator(req); // ✅ safe IPv4 & IPv6 handling
};

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too many authentication attempts, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: defaultHandler,
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: defaultHandler,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: defaultHandler,
});

// URL shortening rate limiting
export const urlLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 URL creations per minute
  message: {
    success: false,
    message: 'Too many URL shortening requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// URL access rate limiting (more lenient)
export const accessLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 URL accesses per minute
  message: {
    success: false,
    message: 'Too many URL access requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createLimiter = (opts = {}) =>
  rateLimit({
    windowMs: opts.windowMs ?? 15 * 60 * 1000,
    max: opts.max ?? 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: opts.keyGenerator ?? keyGenerator,
    handler: opts.handler ?? defaultHandler,
  });

export default generalLimiter;
