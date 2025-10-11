import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../../infrastructure/cache/CacheService';
import { logger } from '../../shared/utils/logger';

/**
 * Middleware de cache para GET requests
 */
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Solo cachear GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generar key de cache
      const cacheKey = `cache:${req.originalUrl}`;

      // Intentar obtener de cache
      const cached = await cacheService.get(cacheKey);

      if (cached) {
        logger.debug(`Cache hit: ${cacheKey}`);
        return res.json(cached);
      }

      // Si no está en cache, interceptar res.json
      const originalJson = res.json.bind(res);

      res.json = (body: any) => {
        // Guardar en cache solo si la respuesta es exitosa
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheService.set(cacheKey, body, ttl).catch((error) => {
            logger.error('Error saving to cache:', error);
          });
        }

        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Middleware para invalidar cache
 */
export const invalidateCacheMiddleware = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Guardar el método original
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      // Invalidar cache después de responder
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patterns.forEach((pattern) => {
          cacheService.delPattern(`cache:${pattern}`).catch((error) => {
            logger.error('Error invalidating cache:', error);
          });
        });
      }

      return originalJson(body);
    };

    next();
  };
};
