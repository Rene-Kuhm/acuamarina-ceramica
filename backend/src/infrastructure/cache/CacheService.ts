import { redis, isRedisConnected } from './redis';
import { logger } from '../../shared/utils/logger';

export class CacheService {
  private static instance: CacheService;
  private defaultTTL: number = 3600; // 1 hora por defecto

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Guardar en cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!isRedisConnected()) {
      logger.warn('Redis not connected, skipping cache set');
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      const expiry = ttl || this.defaultTTL;
      await redis.setex(key, expiry, serialized);
      logger.debug(`Cache set: ${key} (TTL: ${expiry}s)`);
    } catch (error) {
      logger.error('Error setting cache:', error);
    }
  }

  /**
   * Obtener de cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!isRedisConnected()) {
      logger.warn('Redis not connected, skipping cache get');
      return null;
    }

    try {
      const cached = await redis.get(key);
      if (!cached) {
        logger.debug(`Cache miss: ${key}`);
        return null;
      }

      logger.debug(`Cache hit: ${key}`);
      return JSON.parse(cached) as T;
    } catch (error) {
      logger.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Eliminar de cache
   */
  async del(key: string): Promise<void> {
    if (!isRedisConnected()) {
      return;
    }

    try {
      await redis.del(key);
      logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      logger.error('Error deleting cache:', error);
    }
  }

  /**
   * Eliminar por patrón
   */
  async delPattern(pattern: string): Promise<void> {
    if (!isRedisConnected()) {
      return;
    }

    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        logger.debug(`Cache deleted by pattern: ${pattern} (${keys.length} keys)`);
      }
    } catch (error) {
      logger.error('Error deleting cache by pattern:', error);
    }
  }

  /**
   * Verificar si existe
   */
  async exists(key: string): Promise<boolean> {
    if (!isRedisConnected()) {
      return false;
    }

    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Error checking cache existence:', error);
      return false;
    }
  }

  /**
   * Obtener TTL restante
   */
  async ttl(key: string): Promise<number> {
    if (!isRedisConnected()) {
      return -1;
    }

    try {
      return await redis.ttl(key);
    } catch (error) {
      logger.error('Error getting TTL:', error);
      return -1;
    }
  }

  /**
   * Cache with callback (get or set)
   */
  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Intentar obtener de cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Si no está en cache, ejecutar callback
    const value = await callback();

    // Guardar en cache
    await this.set(key, value, ttl);

    return value;
  }

  /**
   * Limpiar toda la cache
   */
  async flush(): Promise<void> {
    if (!isRedisConnected()) {
      return;
    }

    try {
      await redis.flushdb();
      logger.info('✓ Cache flushed');
    } catch (error) {
      logger.error('Error flushing cache:', error);
    }
  }

  /**
   * Obtener estadísticas
   */
  async stats(): Promise<any> {
    if (!isRedisConnected()) {
      return { connected: false };
    }

    try {
      const info = await redis.info('stats');
      const dbSize = await redis.dbsize();

      return {
        connected: true,
        dbSize,
        info: info.split('\r\n').reduce((acc: any, line: string) => {
          const [key, value] = line.split(':');
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        }, {}),
      };
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      return { connected: false, error };
    }
  }
}

// Exportar instancia singleton
export const cacheService = CacheService.getInstance();
