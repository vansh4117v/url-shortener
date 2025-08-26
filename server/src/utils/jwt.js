import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

// Generate an access token
export const generateToken = (userId, expiresIn = config.JWT_EXPIRES_IN) => {
  if (!userId) {
    throw new Error("User ID is required to generate token");
  }

  return jwt.sign(
    { id: userId }, 
    config.JWT_SECRET,
    {
      expiresIn,              
      issuer: "url-shortener-api",   
      audience: "url-shortener-client" 
    }
  );
};

// Verify a token
export const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    return jwt.verify(token, config.JWT_SECRET, {
      issuer: "url-shortener-api",
      audience: "url-shortener-client"
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
};

// Generate a refresh token (longer-lived token)
export const generateRefreshToken = (userId) => {
  return generateToken(userId, "30d");
};

// Decode a token (without verification)
export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    throw new Error("Token decoding failed");
  }
};
