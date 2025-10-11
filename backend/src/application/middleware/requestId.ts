import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../../shared/utils/logger';

// Extender el tipo Request para incluir requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Middleware para generar o extraer Request ID
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obtener ID del header o generar uno nuevo
  const requestId =
    (req.headers['x-request-id'] as string) ||
    (req.headers['x-correlation-id'] as string) ||
    randomUUID();

  // Asignar al request
  req.requestId = requestId;

  // Añadir a los headers de respuesta
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-Correlation-ID', requestId);

  // Log con request ID
  logger.info(`[${requestId}] ${req.method} ${req.originalUrl}`, {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  next();
};

/**
 * Obtener el request ID del contexto
 */
export const getRequestId = (req: Request): string => {
  return req.requestId || 'unknown';
};
