// Vercel Serverless Function Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';

// Express app
const app = express();

// Database connection (singleton for serverless)
let pool: Pool | null = null;

const getDbPool = () => {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '5'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
};

// Middleware básico
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: process.env.CORS_CREDENTIALS === 'true',
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde',
});
app.use('/api', limiter);

// Health checks
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health/ready', async (req: Request, res: Response) => {
  try {
    const db = getDbPool();
    await db.query('SELECT 1');
    res.json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/health/detailed', async (req: Request, res: Response) => {
  try {
    const db = getDbPool();
    const dbResult = await db.query('SELECT NOW()');

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        status: 'connected',
        host: process.env.DB_HOST,
        timestamp: dbResult.rows[0].now,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});

// API Info
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'API Aguamarina Mosaicos',
    version: 'v1',
    status: 'online',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      orders: '/api/v1/orders',
      customers: '/api/v1/customers',
      stats: '/api/v1/stats',
    },
    documentation: '/api-docs',
  });
});

// Categories endpoint
app.get('/api/v1/categories', async (req: Request, res: Response) => {
  try {
    const db = getDbPool();
    const result = await db.query(`
      SELECT id, name, slug, description, image, created_at, updated_at
      FROM categories
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Products endpoint
app.get('/api/v1/products', async (req: Request, res: Response) => {
  try {
    const db = getDbPool();
    const { category, featured, limit = '50', offset = '0' } = req.query;

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (featured === 'true') {
      query += ` AND p.featured = true`;
    }

    query += ` ORDER BY p.created_at DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Product by slug
app.get('/api/v1/products/:slug', async (req: Request, res: Response) => {
  try {
    const db = getDbPool();
    const { slug } = req.params;

    const result = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Auth - Login
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
      });
    }

    const db = getDbPool();
    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Por ahora, mock del token (implementar bcrypt + JWT después)
    res.json({
      success: true,
      data: {
        user: result.rows[0],
        token: 'mock-jwt-token-' + Date.now(),
      },
      message: 'Login exitoso',
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el login',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Export para Vercel
export default app;
