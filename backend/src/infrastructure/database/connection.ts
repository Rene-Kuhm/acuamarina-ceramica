import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../../shared/utils/logger';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'acuamarina_ceramicos',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool(poolConfig);

    pool.on('connect', () => {
      logger.info('Nueva conexión establecida al pool de PostgreSQL');
    });

    pool.on('error', (err) => {
      logger.error('Error inesperado en el pool de PostgreSQL:', err);
      process.exit(-1);
    });
  }

  return pool;
};

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await getPool().connect();
    logger.info('✓ Conexión exitosa a PostgreSQL');
    logger.info(`  Base de datos: ${poolConfig.database}`);
    logger.info(`  Host: ${poolConfig.host}:${poolConfig.port}`);
    client.release();
  } catch (error) {
    logger.error('✗ Error al conectar a PostgreSQL:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Conexión a PostgreSQL cerrada');
  }
};

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await getPool().query(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === 'development') {
    logger.debug('Query ejecutada:', {
      text,
      duration: `${duration}ms`,
      rows: res.rowCount,
    });
  }

  return res;
};

// Helper para transacciones
export const transaction = async <T>(
  callback: (client: any) => Promise<T>
): Promise<T> => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
