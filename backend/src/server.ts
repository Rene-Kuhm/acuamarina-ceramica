import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { validateEnv } from './config/validateEnv';
import { config } from './config/environment';
import { swaggerOptions } from './config/swagger';
import { connectDatabase } from './infrastructure/database/connection';
import { connectRedis, disconnectRedis } from './infrastructure/cache/redis';
import { requestIdMiddleware } from './application/middleware/requestId';
import { errorHandler } from './application/middleware/errorHandler';
import { logger } from './shared/utils/logger';
import { HealthController } from './application/controllers/HealthController';
import authRoutes from './application/routes/auth.routes';
import productsRoutes from './application/routes/products.routes';
import categoriesRoutes from './application/routes/categories.routes';
import statsRoutes from './application/routes/stats.routes';
import ordersRoutes from './application/routes/orders.routes';
import customersRoutes from './application/routes/customers.routes';
import uploadRoutes from './application/routes/upload.routes';
import exportRoutes from './application/routes/export.routes';
import mercadopagoRoutes from './application/routes/mercadopago.routes';

// Validar variables de entorno al inicio
validateEnv();

const app = express();

// Trust proxy - DEBE estar antes de cualquier middleware
// Railway, Vercel, y otros servicios cloud usan proxies reversos
app.set('trust proxy', 1);

// Swagger Documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Request ID / Correlation ID (debe ser lo primero)
app.use(requestIdMiddleware);

// Seguridad
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde',
});
app.use(`/api`, limiter);

// Parseo de body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compresión
app.use(compression());

// Logging de requests
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// Swagger UI - Documentación de API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Aguamarina - Documentación',
}));

// Swagger JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check básico del servidor
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Servidor funcionando
 */
app.get('/health', HealthController.basic);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check (con DB y Redis)
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Servicios listos
 *       503:
 *         description: Servicios no disponibles
 */
app.get('/health/ready', HealthController.ready);

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Servidor vivo
 */
app.get('/health/live', HealthController.live);

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Health check detallado con métricas
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Estado detallado del sistema
 */
app.get('/health/detailed', HealthController.detailed);

// Rutas API
const apiRouter = express.Router();

// Auth routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productsRoutes);
apiRouter.use('/categories', categoriesRoutes);
apiRouter.use('/stats', statsRoutes);
apiRouter.use('/orders', ordersRoutes);
apiRouter.use('/customers', customersRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/export', exportRoutes);
apiRouter.use('/mercadopago', mercadopagoRoutes);

// API info endpoint
apiRouter.get('/', (req, res) => {
  res.json({
    message: 'API Aguamarina Mosaicos',
    version: config.apiVersion,
    endpoints: {
      auth: '/auth',
      products: '/products',
      categories: '/categories',
      orders: '/orders',
      customers: '/customers',
      users: '/users',
      stats: '/stats',
      mercadopago: '/mercadopago',
    },
  });
});

app.use(`/api/${config.apiVersion}`, apiRouter);

// Ruta raíz - Información del servidor
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Aguamarina Mosaicos - Servidor activo',
    version: config.apiVersion,
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    endpoints: {
      api: `/api/${config.apiVersion}`,
      documentation: '/api-docs',
      health: {
        basic: '/health',
        ready: '/health/ready',
        live: '/health/live',
        detailed: '/health/detailed',
      },
    },
    links: {
      api: `https://diligent-upliftment-production-54de.up.railway.app/api/${config.apiVersion}`,
      docs: 'https://diligent-upliftment-production-54de.up.railway.app/api-docs',
      health: 'https://diligent-upliftment-production-54de.up.railway.app/health',
    },
  });
});

// Manejo de errores
app.use(errorHandler);

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    availableEndpoints: {
      api: `/api/${config.apiVersion}`,
      documentation: '/api-docs',
      health: '/health',
    },
  });
});

// Iniciar servidor
let server: any;

const startServer = async () => {
  try {
    // Conectar a la base de datos (opcional - no bloquea el inicio)
    try {
      await connectDatabase();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.warn('⚠️ Database not available, continuing without database');
      logger.warn('   The server will start but database-dependent features will fail');
    }

    // Conectar a Redis (opcional - no bloquea el inicio)
    try {
      await connectRedis();
      logger.info('✅ Redis connected successfully');
    } catch (error) {
      logger.warn('⚠️ Redis not available, continuing without cache');
    }

    // Iniciar servidor
    server = app.listen(config.port, () => {
      logger.info('===========================================');
      logger.info('🚀 Servidor Aguamarina Mosaicos iniciado');
      logger.info(`   Entorno: ${config.nodeEnv}`);
      logger.info(`   Puerto: ${config.port}`);
      logger.info(`   API: http://localhost:${config.port}/api/${config.apiVersion}`);
      logger.info(`   Swagger: http://localhost:${config.port}/api-docs`);
      logger.info(`   Health: http://localhost:${config.port}/health`);
      logger.info('===========================================');
    });

    // Manejar errores del servidor
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Error: El puerto ${config.port} ya está en uso`);
        logger.info('💡 Soluciones:');
        logger.info(`   1. Ejecuta: powershell -ExecutionPolicy Bypass -File kill-port.ps1`);
        logger.info(`   2. O cambia el puerto en el archivo .env`);
        process.exit(1);
      } else {
        logger.error('Error en el servidor:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} recibido, iniciando cierre graceful...`);

  if (server) {
    // Dejar de aceptar nuevas conexiones
    server.close(async () => {
      logger.info('✓ Servidor HTTP cerrado');

      try {
        // Cerrar conexiones de base de datos
        const { pool } = await import('./infrastructure/database/connection');
        await pool.end();
        logger.info('✓ Conexiones de base de datos cerradas');

        // Cerrar conexión de Redis
        await disconnectRedis();

        logger.info('✓ Cierre graceful completado');
        process.exit(0);
      } catch (error) {
        logger.error('Error durante el cierre graceful:', error);
        process.exit(1);
      }
    });

    // Forzar cierre después de 10 segundos
    setTimeout(() => {
      logger.error('❌ No se pudo cerrar gracefully, forzando cierre...');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Manejo de señales de terminación
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

startServer();
