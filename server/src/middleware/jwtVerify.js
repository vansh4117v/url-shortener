import User from "../models/user.js";
import { verifyToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

export const jwtVerify = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token required", 
        errors: [] 
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    
    // Check if user still exists
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
        errors: [],
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.warn('JWT verification failed:', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    if (error.name === 'TokenExpiredError') {
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
