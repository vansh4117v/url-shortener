import { z } from "zod";

const DANGEROUS_PROTOCOLS = ["javascript:", "data:", "vbscript:", "file:", "ftp:"];
const MAX_URL_LENGTH = parseInt(process.env.MAX_URL_LENGTH) || 2048;

export const createUrlSchema = z.object({
  longUrl: z
    .string()
    .trim()
    .min(1, "Long URL is required")
    .max(MAX_URL_LENGTH, `URL cannot exceed ${MAX_URL_LENGTH} characters`)
    .url("Invalid URL format")
    .refine(
      (url) => !DANGEROUS_PROTOCOLS.some((protocol) => url.toLowerCase().startsWith(protocol)),
      "URL contains dangerous protocol"
    )
    .refine((url) => {
      try {
        const urlObj = new URL(url);
        return ["http:", "https:"].includes(urlObj.protocol);
      } catch {
        return false;
      }
    }, "Only HTTP and HTTPS URLs are allowed"),
  shortId: z
    .string()
    .trim()
    .min(3, "Short ID must be at least 3 characters")
    .max(20, "Short ID cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Short ID can only contain letters, numbers, hyphens, and underscores"
    )
    .optional(),
  title: z.string().trim().max(200, "Title cannot exceed 200 characters").optional(),
});

export const getUrlSchema = z.object({
  shortId: z
    .string()
    .trim()
    .min(1, "Short ID is required")
    .max(20, "Invalid short ID format")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid short ID format"),
});
