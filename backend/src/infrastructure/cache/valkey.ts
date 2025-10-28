import Redis from 'ioredis';
import { logger } from '../../shared/utils/logger';

// Configuración de Valkey
// Valkey es un fork open-source de Redis completamente compatible con el protocolo Redis
// Usamos ioredis como cliente ya que es compatible con ambos
const valkeyConfig = {
  host: process.env.VALKEY_HOST || 'localhost',
  port: parseInt(process.env.VALKEY_PORT || '6379'),
  password: process.env.VALKEY_PASSWORD,
  db: parseInt(process.env.VALKEY_DB || '0'),
  retryStrategy: (times: number) => {
    // Dejar de intentar después de 3 intentos
    if (times > 3) {
      logger.warn('⚠️ Valkey no disponible - continuando sin cache');
      return null;
    }
    const delay = Math.min(times * 1000, 3000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
  // Configuración adicional para Railway
  connectTimeout: 10000,
  keepAlive: 30000,
};

// Cliente Valkey
export const valkey = new Redis(valkeyConfig);

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
