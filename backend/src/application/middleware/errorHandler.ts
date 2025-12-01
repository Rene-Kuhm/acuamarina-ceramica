import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { logger } from '../../shared/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log completo del error siempre
  logger.error('🔥 Error Handler:', {
    message: err.message,
    code: (err as any).code,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Error de PostgreSQL - Violación de constraint unique
  if ((err as any).code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe',
      detail: (err as any).detail,
    });
  }

  // Error de PostgreSQL - Violación de FK
  if ((err as any).code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida',
      detail: (err as any).detail,
    });
  }

  // Error de conexión a base de datos
  if ((err as any).code === 'ECONNREFUSED' || (err as any).code === 'ETIMEDOUT') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      code: (err as any).code,
    });
  }

  // Error de PostgreSQL genérico
  if ((err as any).code && (err as any).code.startsWith('2')) {
    return res.status(400).json({
      success: false,
      message: 'Error en la operación de base de datos',
      detail: (err as any).detail || err.message,
      code: (err as any).code,
    });
  }

  // Error no controlado - siempre incluir algo de info para debugging
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    // Incluir info básica del error incluso en producción para debugging
    errorType: err.constructor.name,
    errorCode: (err as any).code || 'UNKNOWN',
    ...(process.env.NODE_ENV !== 'production' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};
