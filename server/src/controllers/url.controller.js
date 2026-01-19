import Url from "../models/url.js";
import { generateUniqueShortId } from "../utils/shortIdGenerator.js";
import { createUrlSchema, getUrlSchema } from "../validators/url.js";
import { logger } from "../utils/logger.js";
import {
  cacheUrl,
  getCachedUrl,
  deleteCachedUrl,
  incrementClicks,
  deleteClickCount,
  refreshUrlTTL,
} from "../utils/redisService.js";

export const shortenUrlController = async (req, res, next) => {
  try {
    const validate = createUrlSchema.safeParse(req.body);
    if (!validate.success) {
      const formattedErrors = validate.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const body = validate.data;

    // Check if custom shortId is provided and available
    if (body.shortId) {
      const existing = await Url.findOne({ shortId: body.shortId }).lean();
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Short ID already exists",
          errors: [{ field: "shortId", message: "This short ID is already taken" }],
        });
      }
    } else {
      const shortId = await generateUniqueShortId();
      body.shortId = shortId;
    }

    const url = new Url({
      longUrl: body.longUrl,
      shortId: body.shortId,
      owner: req.user.id,
      title: body.title || "",
    });

    await url.save();
    cacheUrl(url.shortId, url.longUrl);

    logger.info("URL shortened", {
      userId: req.user.id,
      shortId: url.shortId,
      longUrl: body.longUrl,
    });

    res.status(201).json({
      success: true,
      message: "URL shortened successfully",
      data: {
        longUrl: url.longUrl,
        shortId: url.shortId,
        title: url.title,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    logger.error("Error in shortenUrlController:", {
      error: error.message,
      userId: req.user?._id,
      body: req.body,
    });
    next(error);
  }
};

export const getUrlController = async (req, res, next) => {
  try {
    const validate = getUrlSchema.safeParse(req.params);
    if (!validate.success) {
      const formattedErrors = validate.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const { shortId } = validate.data;

    let longUrl = await getCachedUrl(shortId);
    if (longUrl) {
      refreshUrlTTL(shortId);
      incrementClicks(shortId);
    } else {
      const url = await Url.findOne({ shortId }).lean();

      if (!url) {
        return res.status(404).json({
          success: false,
          message: "URL not found",
        });
      }

      longUrl = url.longUrl;

      cacheUrl(shortId, longUrl);
      incrementClicks(shortId);

      logger.info("URL accessed from database", {
        shortId,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
    }

    // res.status(302).redirect(longUrl);
    res.status(200).json({
      success: true,
      message: "URL retrieved successfully",
      data: {
        longUrl: longUrl,
      },
    });
  } catch (error) {
    logger.error("Error in getUrlController:", {
      error: error.message,
      shortId: req.params.shortId,
    });
    next(error);
  }
};

export const getAllUrlController = async (req, res, next) => {
  try {
    const _id = req.user.id;
    const urls = await Url.find({ owner: _id }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      message: urls.length ? "Retrieved successfully" : "No URLs found",
      data: urls,
    });
  } catch (error) {
    logger.error("Error in getAllUrlController:", {
      error: error.message,
      userId: req.user.id,
    });
    next(error);
  }
};

export const deleteUrlController = async (req, res, next) => {
  try {
    const validate = getUrlSchema.safeParse(req.params);
    if (!validate.success) {
      const formattedErrors = validate.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const { shortId } = validate.data;
    const url = await Url.deleteOne({ shortId, owner: req.user.id });

    if (!url.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "URL not found or you do not have permission to delete it",
      });
    }

    deleteCachedUrl(shortId);
    deleteClickCount(shortId);

    logger.info("URL deleted", {
      shortId: shortId,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    logger.error("Error in deleteUrlController:", {
      error: error.message,
      userId: req.user.id,
      shortId: req.params.shortId,
    });
    next(error);
  }
};

export const getUrlInfoController = async (req, res, next) => {
  try {
    const validate = getUrlSchema.safeParse(req.params);
    if (!validate.success) {
      const formattedErrors = validate.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    const { shortId } = validate.data;
    const url = await Url.findOne({ shortId, owner: req.user.id }).lean();

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found or you do not have permission to view it",
      });
    }

    res.status(200).json({
      success: true,
      message: "URL info retrieved successfully",
      data: url,
    });
  } catch (error) {
    logger.error("Error in getUrlInfoController:", {
      error: error.message,
      userId: req.user.id,
      shortId: req.params.shortId,
    });
    next(error);
  }
};
