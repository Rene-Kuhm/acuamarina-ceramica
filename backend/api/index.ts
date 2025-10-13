// Vercel Serverless Function Entry Point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../src/config/environment';
import { swaggerOptions } from '../src/config/swagger';
import { connectDatabase } from '../src/infrastructure/database/connection';
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

const app = express();

// Swagger Documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Request ID / Correlation ID
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

// Manejo de errores
app.use(errorHandler);

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Conectar a la base de datos al inicio (singleton pattern para Vercel)
let dbConnected = false;

const ensureDbConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
      logger.info('✅ Database connected (Vercel serverless)');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }
};

// Middleware para asegurar conexión DB en cada request
app.use(async (req, res, next) => {
  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection unavailable',
    });
  }
});

// Export para Vercel
export default app;
