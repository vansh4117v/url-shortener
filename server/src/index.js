import "dotenv/config";
import { connectDB } from "./config/db.js"; 
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { startClickCountSync, syncClickCounts } from "./utils/clickSync.js";
import app from "./app.js";
const PORT = config.PORT;

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  // Close HTTP server
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    // Sync any remaining click counts before disconnecting
    try {
      logger.info('Syncing remaining click counts...');
      await syncClickCounts();
      logger.info('Click counts synced successfully');
    } catch (error) {
      logger.error('Error syncing click counts during shutdown:', error);
    }
    
    try {
      await disconnectRedis();
      logger.info('Redis disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting Redis:', error);
    }
    
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
Promise.all([connectDB(), connectRedis()])
  .then(() => {
    logger.info("Database and Redis connected successfully");
    
    startClickCountSync();
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  })
  .catch((err) => {
    logger.error("Failed to connect to database or Redis:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(async () => {
    try {
      await syncClickCounts();
      await disconnectRedis();
    } catch (error) {
      logger.error('Error during emergency shutdown:', error);
    }
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  logger.error('Uncaught Exception:', err);
  try {
    await syncClickCounts();
    await disconnectRedis();
  } catch (error) {
    logger.error('Error during emergency shutdown:', error);
  }
  process.exit(1);
});
