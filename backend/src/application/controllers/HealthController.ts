import { Request, Response } from 'express';
import { pool } from '../../infrastructure/database/connection';
import { isRedisConnected } from '../../infrastructure/cache/redis';
import { cacheService } from '../../infrastructure/cache/CacheService';
import os from 'os';

export class HealthController {
  /**
   * Health check básico
   */
  static async basic(req: Request, res: Response) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  }

  /**
   * Health check completo (readiness)
   */
  static async ready(req: Request, res: Response) {
    const checks = await HealthController.performHealthChecks();

    const isHealthy = checks.database.status === 'up' && checks.redis.status === 'up';

    const statusCode = isHealthy ? 200 : 503;

    res.status(statusCode).json({
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    });
  }

  /**
   * Liveness check (el servidor está vivo)
   */
  static async live(req: Request, res: Response) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }

  /**
   * Health check detallado con métricas
   */
  static async detailed(req: Request, res: Response) {
    const checks = await HealthController.performHealthChecks();
    const metrics = HealthController.getSystemMetrics();

    const isHealthy = checks.database.status === 'up';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      checks,
      metrics,
    });
  }

  /**
   * Realizar todos los health checks
   */
  private static async performHealthChecks() {
    const [databaseCheck, redisCheck] = await Promise.all([
      HealthController.checkDatabase(),
      HealthController.checkRedis(),
    ]);

    return {
      database: databaseCheck,
      redis: redisCheck,
    };
  }

  /**
   * Verificar conexión a base de datos
   */
  private static async checkDatabase() {
    try {
      const start = Date.now();
      const result = await pool.query('SELECT 1 as health');
      const responseTime = Date.now() - start;

      return {
        status: 'up',
        responseTime: `${responseTime}ms`,
        message: 'Database connection is healthy',
        details: {
          totalConnections: pool.totalCount,
          idleConnections: pool.idleCount,
          waitingConnections: pool.waitingCount,
        },
      };
    } catch (error: any) {
      return {
        status: 'down',
        message: 'Database connection failed',
        error: error.message,
      };
    }
  }

  /**
   * Verificar conexión a Redis
   */
  private static async checkRedis() {
    try {
      if (!isRedisConnected()) {
        return {
          status: 'down',
          message: 'Redis is not connected',
        };
      }

      const start = Date.now();
      const stats = await cacheService.stats();
      const responseTime = Date.now() - start;

      return {
        status: 'up',
        responseTime: `${responseTime}ms`,
        message: 'Redis connection is healthy',
        details: {
          dbSize: stats.dbSize,
        },
      };
    } catch (error: any) {
      return {
        status: 'down',
        message: 'Redis connection failed',
        error: error.message,
      };
    }
  }

  /**
   * Obtener métricas del sistema
   */
  private static getSystemMetrics() {
    const memoryUsage = process.memoryUsage();

    return {
      process: {
        uptime: `${Math.floor(process.uptime())}s`,
        pid: process.pid,
        nodeVersion: process.version,
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
        freeMemory: `${Math.round(os.freemem() / 1024 / 1024 / 1024)}GB`,
        uptime: `${Math.floor(os.uptime())}s`,
        loadAverage: os.loadavg(),
      },
    };
  }
}
