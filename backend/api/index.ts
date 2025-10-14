import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Singleton DB pool
let pool: Pool | null = null;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// Main handler
export default async (req: VercelRequest, res: VercelResponse) => {
  // Add CORS headers to all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace(/^\/api/, '') || '/';

  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // API v1 info
    if ((path === '/v1' || path === '/v1/') && method === 'GET') {
      return res.json({
        message: 'API Aguamarina Mosaicos',
        version: 'v1',
        status: 'online',
        endpoints: {
          auth: '/api/v1/auth/login',
          products: '/api/v1/products',
          categories: '/api/v1/categories',
        },
      });
    }

    // Auth - Login
    if (path === '/v1/auth/login' && method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña requeridos',
        });
      }

      const db = getPool();
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

      return res.json({
        success: true,
        data: {
          user: result.rows[0],
          token: 'mock-jwt-' + Date.now(),
        },
      });
    }

    // Categories
    if (path === '/v1/categories' && method === 'GET') {
      const db = getPool();
      const result = await db.query(
        'SELECT * FROM categories ORDER BY name ASC'
      );
      return res.json({ success: true, data: result.rows });
    }

    // Products
    if (path === '/v1/products' && method === 'GET') {
      const db = getPool();
      const result = await db.query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT 50'
      );
      return res.json({ success: true, data: result.rows });
    }

    // 404
    return res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
      path,
      method,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno',
      error: error instanceof Error ? error.message : 'Unknown',
    });
  }
};
