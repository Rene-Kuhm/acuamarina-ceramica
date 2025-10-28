import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware para validar requests usando express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map((error) => ({
        field: error.type === 'field' ? error.path : undefined,
        message: error.msg,
      })),
    });
  }

  next();
};
