import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js"; 
import { config } from "./config/env.js";
import { securityConfig } from "./config/security.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { logger, morganMiddleware } from "./utils/logger.js";
import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";

const app = express();
const PORT = config.PORT;

// Security middleware
app.use(securityConfig.helmet);
app.use(securityConfig.cors);

// Trust proxy for rate limiting and IP logging
app.set('trust proxy', 1);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

// Logging middleware
app.use(morgan(morganMiddleware, {
  stream: {
    write: (message) => {
      const data = JSON.parse(message);
      logger.http(`${data.method} ${data.url}`, data);
    },
  },
}));

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

// Welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the URL Shortener API",
    version: "1.0.0",
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Start server
let server;
connectDB()
  .then(() => {
    logger.info("Database connected successfully");
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  })
  .catch((err) => {
    logger.error("Database connection failed:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});
