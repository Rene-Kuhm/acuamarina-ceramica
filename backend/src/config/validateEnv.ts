import { z } from 'zod';
import { logger } from '../shared/utils/logger';

// Schema de validación para variables de entorno
const envSchema = z.object({
  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  API_VERSION: z.string().default('v1'),

  // Database (optional for initial deployment)
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number).default('5432'),
  DB_NAME: z.string().default('aguamarina_mosaicos'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_SSL: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  DB_MAX_CONNECTIONS: z.string().regex(/^\d+$/).transform(Number).default('20'),

  // JWT (optional for initial deployment - will generate warnings)
  JWT_SECRET: z.string().default('temporary_secret_change_me_in_production_min32chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().default('temporary_refresh_secret_change_in_production_min32'),
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

  // Valkey (opcionales) - Fork open-source compatible con Redis
  VALKEY_HOST: z.string().default('localhost'),
  VALKEY_PORT: z.string().regex(/^\d+$/).transform(Number).default('6379'),
  VALKEY_PASSWORD: z.string().optional(),
  VALKEY_DB: z.string().regex(/^\d+$/).transform(Number).default('0'),
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
  logger.info(`  VALKEY: ${config.VALKEY_HOST}:${config.VALKEY_PORT}`);
};
