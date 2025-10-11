import { z } from 'zod';
import { logger } from '../shared/utils/logger';

// Schema de validación para variables de entorno
const envSchema = z.object({
  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  API_VERSION: z.string().default('v1'),

  // Database
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number).default('5432'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_SSL: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  DB_MAX_CONNECTIONS: z.string().regex(/^\d+$/).transform(Number).default('20'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Cloudinary (opcionales)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CORS_CREDENTIALS: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/).transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().regex(/^\d+$/).transform(Number).default('100'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  LOG_FILE: z.string().default('logs/app.log'),

  // Upload
  MAX_FILE_SIZE: z.string().regex(/^\d+$/).transform(Number).default('5242880'),
  ALLOWED_IMAGE_TYPES: z.string().default('image/jpeg,image/png,image/webp'),

  // Redis (opcionales)
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().regex(/^\d+$/).transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().regex(/^\d+$/).transform(Number).default('0'),
});

// Tipo inferido del schema
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validar variables de entorno
 */
export const validateEnv = (): EnvConfig => {
  try {
    const validated = envSchema.parse(process.env);

    logger.info('✓ Environment variables validated successfully');

    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('❌ Environment validation failed:');

      error.errors.forEach((err) => {
        logger.error(`  - ${err.path.join('.')}: ${err.message}`);
      });

      logger.error('\nPlease check your .env file and fix the errors above.');
      process.exit(1);
    }

    throw error;
  }
};

/**
 * Mostrar configuración (sin datos sensibles)
 */
export const logEnvConfig = (config: EnvConfig): void => {
  logger.info('Environment Configuration:');
  logger.info(`  NODE_ENV: ${config.NODE_ENV}`);
  logger.info(`  PORT: ${config.PORT}`);
  logger.info(`  DB_HOST: ${config.DB_HOST}:${config.DB_PORT}`);
  logger.info(`  DB_NAME: ${config.DB_NAME}`);
  logger.info(`  DB_SSL: ${config.DB_SSL}`);
  logger.info(`  LOG_LEVEL: ${config.LOG_LEVEL}`);
  logger.info(`  REDIS: ${config.REDIS_HOST}:${config.REDIS_PORT}`);
};
