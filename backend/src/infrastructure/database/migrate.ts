import { readFileSync } from 'fs';
import { join } from 'path';
import { getPool, connectDatabase, disconnectDatabase } from './connection';
import { logger } from '../../shared/utils/logger';

const runMigrations = async () => {
  try {
    logger.info('Iniciando migraciones de base de datos...');

    await connectDatabase();

    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

    await getPool().query(schemaSQL);

    logger.info('✓ Migraciones ejecutadas exitosamente');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error ejecutando migraciones:', error);
    process.exit(1);
  }
};

runMigrations();
