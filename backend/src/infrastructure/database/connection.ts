import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../../shared/utils/logger';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Función para crear la configuración del pool (lazy evaluation)
const createPoolConfig = (): PoolConfig => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Para Neon/Vercel: agregar opciones de serverless
    const url = new URL(databaseUrl);

    // Agregar sslmode si no existe
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }

    return {
      connectionString: url.toString(),
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '5'), // Menos conexiones para serverless
      idleTimeoutMillis: 10000, // Cerrar conexiones idle más rápido
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'aguamarina_mosaicos',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

let poolInstance: Pool | null = null;

export const getPool = (): Pool => {
  if (!poolInstance) {
    const poolConfig = createPoolConfig();
    poolInstance = new Pool(poolConfig);

    poolInstance.on('connect', () => {
      logger.info('Nueva conexión establecida al pool de PostgreSQL');
    });

    // En serverless NO hacer process.exit, solo loguear
    poolInstance.on('error', (err) => {
      logger.error('Error inesperado en el pool de PostgreSQL:', err);
      // Resetear el pool para que se reconecte en la próxima request
      poolInstance = null;
    });
  }

  return poolInstance;
};

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await getPool().connect();
    logger.info('✓ Conexión exitosa a PostgreSQL');

    // Mostrar información de conexión según el tipo de configuración
    if (process.env.DATABASE_URL) {
      logger.info('  Conexión: Supabase Pooler (DATABASE_URL)');
    } else {
      logger.info(`  Base de datos: ${poolConfig.database}`);
      logger.info(`  Host: ${poolConfig.host}:${poolConfig.port}`);
    }

    client.release();
  } catch (error) {
    logger.error('✗ Error al conectar a PostgreSQL:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    logger.info('Conexión a PostgreSQL cerrada');
  }
};

// Exportar getter del pool (NO crear pool al importar - importante para serverless)
export const pool = {
  query: (text: string, params?: any[]) => getPool().query(text, params),
  connect: () => getPool().connect(),
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
