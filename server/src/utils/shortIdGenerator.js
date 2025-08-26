import { nanoid } from "nanoid";
import Url from "../models/url.js";
import { logger } from "./logger.js";

export async function generateUniqueShortId() {
  let id;
  let exists = true;
  let attempts = 0;
  while (exists) {
    id = nanoid(6);
    exists = await Url.exists({ shortId: id });
    attempts++;
    if (exists) {
      logger.warn(`Short ID collision detected: ${id} (attempt ${attempts})`);
    }
  }
  logger.info(`Generated unique short ID: ${id} (attempts: ${attempts})`);
  return id;
}

