import { config } from "../config/env.js";

export const options = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const clearOptions = {
  ...options,
  maxAge: 0,
  expires: new Date(0),
};

export const refreshTokenOptions = {
  ...options,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/api/auth/refresh",
};
