import { z } from 'zod';
import { logger } from '../utils/logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  MONGO_URI: z.string().url('Invalid MongoDB URI'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ALLOWED_ORIGINS: z.string().optional(),
});

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    logger.error('Invalid environment variables:');
    error.errors.forEach((err) => {
      logger.error(`  ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
};

export const config = validateEnv();
