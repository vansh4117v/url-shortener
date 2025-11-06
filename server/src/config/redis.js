import { createClient } from "redis";
import { logger } from "../utils/logger.js";
import { config } from "./env.js";

let redisClient = null;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: config.REDIS_URL,
    });

    await redisClient.connect();
    logger.info("Redis connected successfully");
    return redisClient;
  } catch (error) {
    logger.error("Redis connection failed:", error);
    redisClient = null;
  }
};

export const getRedisClient = () => {
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.disconnect();
    redisClient = null;
    logger.info("Redis disconnected");
  }
};
