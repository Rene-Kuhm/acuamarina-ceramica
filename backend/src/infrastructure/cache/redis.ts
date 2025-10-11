import Redis from 'ioredis';
import { logger } from '../../shared/utils/logger';

// Configuración de Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
};

// Cliente Redis
export const redis = new Redis(redisConfig);

// Eventos de conexión
redis.on('connect', () => {
  logger.info('✓ Conectando a Redis...');
});

redis.on('ready', () => {
  logger.info('✓ Redis conectado y listo');
});

redis.on('error', (error) => {
  logger.error('❌ Error de Redis:', error);
});

redis.on('close', () => {
  logger.warn('⚠️ Conexión a Redis cerrada');
});

redis.on('reconnecting', () => {
  logger.info('🔄 Reconectando a Redis...');
});

/**
 * Conectar a Redis
 */
export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
    logger.info('Redis connection established');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // No lanzar error para permitir que la app funcione sin Redis
  }
};

/**
 * Desconectar de Redis
 */
export const disconnectRedis = async (): Promise<void> => {
  try {
    await redis.quit();
    logger.info('✓ Redis disconnected');
  } catch (error) {
    logger.error('Error disconnecting from Redis:', error);
  }
};

/**
 * Verificar si Redis está conectado
 */
export const isRedisConnected = (): boolean => {
  return redis.status === 'ready';
};
