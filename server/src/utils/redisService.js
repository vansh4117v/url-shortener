import crypto from "crypto";
import { getRedisClient } from "../config/redis.js";
import { logger } from "./logger.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isRedisAvailable = () => {
  const client = getRedisClient();
  if (!client) return false;

  if (typeof client.isReady === "boolean") return client.isReady;
  if (typeof client.isOpen === "boolean") return client.isOpen;

  return true;
};

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

export const acquireUrlLock = async (shortId, ttlMs = 5000) => {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const token = crypto.randomUUID();
    const key = `lock:url:${shortId}`;
    const result = await client.set(key, token, { NX: true, PX: ttlMs });

    return result ? token : null;
  } catch (error) {
    logger.warn("Redis SET lock error:", error);
    return null;
  }
};

export const releaseUrlLock = async (shortId, token) => {
  try {
    const client = getRedisClient();
    if (!client || !token) return;

    const key = `lock:url:${shortId}`;
    const script =
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";

    await client.eval(script, { keys: [key], arguments: [token] });
  } catch (error) {
    logger.warn("Redis DEL lock error:", error);
  }
};

export const waitForCachedUrl = async (shortId, attempts = 5, delayMs = 50) => {
  for (let i = 0; i < attempts; i += 1) {
    await sleep(delayMs);
    const cached = await getCachedUrl(shortId);
    if (cached) return cached;

    delayMs *= 2;
  }

  return null;
};
