import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { logger } from '../../shared/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  // Error no controlado
  logger.error('Error no controlado:', err);

  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};
