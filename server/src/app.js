import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { config } from "./config/env.js";
import { securityConfig } from "./config/security.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { logger, morganMiddleware } from "./utils/logger.js";
import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";

const app = express();

app.use(securityConfig.helmet);
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan(morganMiddleware, {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`${data.method} ${data.url}`, data);
      },
    },
  })
);

app.use(generalLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the URL Shortener API",
    version: "1.0.0",
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;