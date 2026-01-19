import { verifyToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

export const jwtVerifyMiddleware = (req, res, next) => {
  try {
    let token = req?.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        errors: [],
      });
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    next();

  } catch (error) {
    logger.warn('JWT verification failed:', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });

    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        errors: [],
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid access token",
      errors: [],
    });
  }
};
