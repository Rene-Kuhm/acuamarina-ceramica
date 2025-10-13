import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Singleton pool para conexiones
let pool: Pool | null = null;

const getPool = () => {
  if (!pool) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not configured');
    }
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
};

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Health check básico
    const dbPool = getPool();
    const result = await dbPool.query('SELECT NOW() as time, version() as version');

    return res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        time: result.rows[0].time,
        version: result.rows[0].version.split(' ')[0], // Solo el nombre de PostgreSQL
      },
      environment: process.env.NODE_ENV || 'production',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
};
