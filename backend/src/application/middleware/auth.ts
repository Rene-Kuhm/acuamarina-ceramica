import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../infrastructure/security/jwt';
import { UnauthorizedError, ForbiddenError } from '../../shared/errors/AppError';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.substring(7);
    const payload = JWTService.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('No tienes permisos para acceder a este recurso'));
    }

    next();
  };
};
