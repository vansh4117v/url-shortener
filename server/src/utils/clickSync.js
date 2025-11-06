import { getRedisClient } from "../config/redis.js";
import Url from "../models/url.js";
import { logger } from "./logger.js";

export const syncClickCounts = async () => {
  try {
    const client = getRedisClient();
    if (!client) {
      logger.warn("Redis not available, skipping click count sync");
      return;
    }

    const updates = [];
    let cursor = '0';

    do {
      const result = await client.scan(cursor, {
        MATCH: "clicks:*",
        COUNT: 100, 
      });

      cursor = result.cursor;
      const keys = result.keys;

      for (const key of keys) {
        const shortId = key.replace("clicks:", "");
        const clickCount = await client.get(key);

        if (clickCount && parseInt(clickCount) > 0) {
          updates.push({
            updateOne: {
              filter: { shortId },
              update: { $inc: { clicks: parseInt(clickCount) } },
            },
          });

          await client.del(key);
        }
      }
    } while (cursor !== '0');

    if (updates.length > 0) {
      const result = await Url.bulkWrite(updates);
      logger.info(`Synced click counts: ${result.modifiedCount} URLs updated`);
    } else {
      logger.debug("No click counts to sync");
    }
  } catch (error) {
    logger.error("Error syncing click counts:", error);
  }
};

export const startClickCountSync = () => {
  syncClickCounts();

  setInterval(syncClickCounts, 5 * 60 * 1000);

  logger.info("Click count sync started (every 5 minutes)");
};
