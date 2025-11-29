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
import usersRoutes from './application/routes/users.routes';
import uploadRoutes from './application/routes/upload.routes';
import exportRoutes from './application/routes/export.routes';
import mercadopagoRoutes from './application/routes/mercadopago.routes';

// Validar variables de entorno al inicio
// validateEnv(); // Comentado temporalmente para serverless

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

// CORS - Debe estar ANTES de cualquier ruta
app.use(cors(config.cors));

// Manejar preflight requests explícitamente
app.options('*', cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde',
});
app.use('/api', limiter);

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

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API aguamarina - Documentación',
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
apiRouter.use('/users', usersRoutes);
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

// Exportar la app para uso en serverless
export default app;
