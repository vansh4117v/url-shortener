import { getRedisClient } from "../config/redis.js";
import { logger } from "./logger.js";

export const getCachedUrl = async (shortId) => {
  try {
    const client = getRedisClient();
    if (!client) return null;

    return await client.get(`url:${shortId}`);
  } catch (error) {
    logger.warn("Redis GET error:", error);
    return null;
  }
};

export const cacheUrl = async (shortId, longUrl, ttlSeconds = 3600) => {
  try {
    const client = getRedisClient();
    if (!client) return;

    // Set with TTL (default 1 hour)
    await client.setEx(`url:${shortId}`, ttlSeconds, longUrl);
  } catch (error) {
    logger.warn("Redis SET error:", error);
  }
};

export const deleteCachedUrl = async (shortId) => {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(`url:${shortId}`);
  } catch (error) {
    logger.warn("Redis DELETE error:", error);
  }
};

export const incrementClicks = async (shortId) => {
  try {
    const client = getRedisClient();
    if (!client) return 0;

    return await client.incr(`clicks:${shortId}`);
  } catch (error) {
    logger.warn("Redis INCR error:", error);
    return 0;
  }
};

export const getClickCount = async (shortId) => {
  try {
    const client = getRedisClient();
    if (!client) return 0;

    const count = await client.get(`clicks:${shortId}`);
    return parseInt(count) || 0;
  } catch (error) {
    logger.warn("Redis GET clicks error:", error);
    return 0;
  }
};

export const deleteClickCount = async (shortId) => {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(`clicks:${shortId}`);
  } catch (error) {
    logger.warn("Redis DELETE clicks error:", error);
  }
};

export const refreshUrlTTL = async (shortId, ttlSeconds = 3600) => {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.expire(`url:${shortId}`, ttlSeconds);
  } catch (error) {
    logger.warn("Redis EXPIRE error:", error);
  }
};
