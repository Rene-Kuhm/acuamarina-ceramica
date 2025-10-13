// Vercel Serverless Function Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { connectDatabase } from '../src/infrastructure/database/connection';
import { connectRedis } from '../src/infrastructure/cache/redis';
import { logger } from '../src/shared/utils/logger';

// Variable para almacenar el estado de inicialización
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Función de inicialización (se ejecuta una vez por instancia serverless)
const initialize = async (): Promise<void> => {
  // Si ya se está inicializando, esperar a que termine
  if (initializationPromise) {
    return initializationPromise;
  }

  // Si ya está inicializado, no hacer nada
  if (isInitialized) {
    return;
  }

  // Crear una nueva promesa de inicialización
  initializationPromise = (async () => {
    try {
      logger.info('🔄 Initializing serverless function...');

      // Conectar a la base de datos
      await connectDatabase();
      logger.info('✓ Database connected for serverless function');

      // Conectar a Redis (opcional - no bloquea)
      try {
        await connectRedis();
        logger.info('✓ Redis connected for serverless function');
      } catch (error) {
        logger.warn('⚠️ Redis not available, continuing without cache');
      }

      isInitialized = true;
      logger.info('✓ Serverless function initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize serverless function:', error);
      // Resetear para permitir retry
      isInitialized = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
};

// Handler para Vercel Serverless Functions
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Inicializar conexiones si es necesario (lazy initialization)
    await initialize();

    // Pasar la petición a Express
    return app(req, res);
  } catch (error) {
    logger.error('❌ Error in serverless function:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : undefined,
    });
  }
};
