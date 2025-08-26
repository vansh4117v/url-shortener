import rateLimit from 'express-rate-limit';

// General rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiting (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
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
