import Redis from 'ioredis';
import { logger } from '../../shared/utils/logger';

// Configuración de Valkey
// Valkey es un fork open-source de Redis completamente compatible con el protocolo Redis
// Usamos ioredis como cliente ya que es compatible con ambos

// Railway puede proporcionar REDIS_URL o variables individuales
const getValkeyConfig = () => {
  // Opción 1: Usar REDIS_URL si está disponible (más confiable en Railway)
  if (process.env.REDIS_URL) {
    logger.info('📍 Usando REDIS_URL para conectar a Valkey');
    return {
      connectionString: process.env.REDIS_URL,
      retryStrategy: (times: number) => {
        if (times > 3) {
          logger.warn('⚠️ Valkey no disponible - continuando sin cache');
          return null;
        }
        return Math.min(times * 1000, 3000);
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: 10000,
      keepAlive: 30000,
    };
  }

  // Opción 2: Usar variables individuales (VALKEY_HOST, etc.)
  logger.info('📍 Usando variables individuales para conectar a Valkey');
  return {
    host: process.env.VALKEY_HOST || 'localhost',
    port: parseInt(process.env.VALKEY_PORT || '6379'),
    password: process.env.VALKEY_PASSWORD,
    db: parseInt(process.env.VALKEY_DB || '0'),
    retryStrategy: (times: number) => {
      if (times > 3) {
        logger.warn('⚠️ Valkey no disponible - continuando sin cache');
        return null;
      }
      return Math.min(times * 1000, 3000);
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
    connectTimeout: 10000,
    keepAlive: 30000,
  };
};

// Cliente Valkey
export const valkey = new Redis(getValkeyConfig() as any);

// Eventos de conexión
valkey.on('connect', () => {
  logger.info('✓ Conectando a Valkey...');
});

valkey.on('ready', () => {
  logger.info('✓ Valkey conectado y listo');
});

valkey.on('error', (error) => {
  logger.error('❌ Error de Valkey:', error);
});

valkey.on('close', () => {
  logger.warn('⚠️ Conexión a Valkey cerrada');
});

valkey.on('reconnecting', () => {
  logger.info('🔄 Reconectando a Valkey...');
});

/**
 * Conectar a Valkey
 */
export const connectValkey = async (): Promise<void> => {
  try {
    await valkey.connect();
    logger.info('Valkey connection established');
  } catch (error) {
    logger.error('Failed to connect to Valkey:', error);
    // No lanzar error para permitir que la app funcione sin Valkey
  }
};

/**
 * Desconectar de Valkey
 */
export const disconnectValkey = async (): Promise<void> => {
  try {
    await valkey.quit();
    logger.info('✓ Valkey disconnected');
  } catch (error) {
    logger.error('Error disconnecting from Valkey:', error);
  }
};

/**
 * Verificar si Valkey está conectado
 */
export const isValkeyConnected = (): boolean => {
  return valkey.status === 'ready';
};
