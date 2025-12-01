import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { validateEnv } from '../src/config/validateEnv';
import { config } from '../src/config/environment';
import { swaggerOptions } from '../src/config/swagger';
import { connectDatabase } from '../src/infrastructure/database/connection';
import { connectValkey } from '../src/infrastructure/cache/valkey';
import { requestIdMiddleware } from '../src/application/middleware/requestId';
import { errorHandler } from '../src/application/middleware/errorHandler';
import { logger } from '../src/shared/utils/logger';
import { HealthController } from '../src/application/controllers/HealthController';
import authRoutes from '../src/application/routes/auth.routes';
import productsRoutes from '../src/application/routes/products.routes';
import categoriesRoutes from '../src/application/routes/categories.routes';
import statsRoutes from '../src/application/routes/stats.routes';
import ordersRoutes from '../src/application/routes/orders.routes';
import customersRoutes from '../src/application/routes/customers.routes';
import uploadRoutes from '../src/application/routes/upload.routes';
import exportRoutes from '../src/application/routes/export.routes';
import mercadopagoRoutes from '../src/application/routes/mercadopago.routes';
import addressesRoutes from '../src/application/routes/addresses.routes';
import newsletterRoutes from '../src/application/routes/newsletter.routes';
import reviewRoutes from '../src/application/routes/review.routes';
import contactRoutes from '../src/application/routes/contact.routes';
import testEmailRoutes from '../src/application/routes/test-email.routes';

// Validar variables de entorno al inicio (con manejo de errores para serverless)
try {
  validateEnv();
} catch (error) {
  console.error('⚠️ Environment validation warning:', error);
  // No hacer exit en serverless, continuar con defaults
}

const app = express();

// Trust proxy - Vercel usa proxies reversos
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

// Health checks
app.get('/health', HealthController.basic);
app.get('/health/ready', HealthController.ready);
app.get('/health/live', HealthController.live);
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
apiRouter.use('/addresses', addressesRoutes);
apiRouter.use('/newsletter', newsletterRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/test-email', testEmailRoutes);

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
      addresses: '/addresses',
      newsletter: '/newsletter',
      reviews: '/reviews',
      contact: '/contact',
    },
  });
});

app.use(`/api/${config.apiVersion}`, apiRouter);

// Ruta raíz - Información del servidor
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Aguamarina Mosaicos - Servidor activo en Vercel',
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

// Inicializar conexiones (para serverless)
let isInitialized = false;

const initializeConnections = async () => {
  if (isInitialized) return;

  try {
    // Conectar a la base de datos
    await connectDatabase();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.warn('⚠️ Database not available');
  }

  try {
    // Conectar a Valkey
    await connectValkey();
    logger.info('✅ Valkey connected successfully');
  } catch (error) {
    logger.warn('⚠️ Valkey not available');
  }

  isInitialized = true;
};

// Export para Vercel Serverless
export default async (req: VercelRequest, res: VercelResponse) => {
  await initializeConnections();
  return app(req as any, res as any);
};
