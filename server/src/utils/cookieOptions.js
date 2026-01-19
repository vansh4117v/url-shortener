import { config } from "../config/env.js";

export const cookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production", // true for HTTPS
  sameSite: config.NODE_ENV === "production" ? "none" : "lax", // none for prod, lax for dev
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const clearCookieOptions = {
  ...cookieOptions,
  maxAge: 0,
  expires: new Date(0),
};