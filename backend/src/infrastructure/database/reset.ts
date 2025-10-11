import { getPool, connectDatabase, disconnectDatabase } from './connection';
import { logger } from '../../shared/utils/logger';

const resetDatabase = async () => {
  try {
    logger.warn('⚠️  ADVERTENCIA: Esto eliminará todos los datos de la base de datos');
    logger.info('Reseteando base de datos...');

    await connectDatabase();
    const pool = getPool();

    // Eliminar todas las tablas
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);

    logger.info('✓ Base de datos reseteada exitosamente');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error reseteando base de datos:', error);
    process.exit(1);
  }
};

resetDatabase();
