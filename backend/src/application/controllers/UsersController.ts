import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

export class UsersController {
  /**
   * Get current user profile
   * GET /api/v1/users/profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
      }

      const result = await getPool().query(
        'SELECT id, email, name, phone, role, created_at, updated_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/users/profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
      }

      const data = updateProfileSchema.parse(req.body);

      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (data.name !== undefined) {
        updates.push(`name = $${paramCount}`);
        values.push(data.name);
        paramCount++;
      }

      if (data.phone !== undefined) {
        updates.push(`phone = $${paramCount}`);
        values.push(data.phone || null);
        paramCount++;
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No hay datos para actualizar',
        });
      }

      updates.push(`updated_at = NOW()`);
      values.push(userId);

      const result = await getPool().query(
        `UPDATE users
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, email, name, phone, role, created_at, updated_at`,
        values
      );

      logger.info(`Perfil actualizado para usuario ${userId}`);

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Perfil actualizado exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * Update user password
   * PUT /api/v1/users/password
   */
  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
      }

      const data = updatePasswordSchema.parse(req.body);

      // Verificar contraseña actual
      const userResult = await getPool().query(
        'SELECT password FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      const user = userResult.rows[0];
      const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);

      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña actual es incorrecta',
        });
      }

      // Hash nueva contraseña
      const newPasswordHash = await bcrypt.hash(data.newPassword, 12);

      // Actualizar contraseña
      await getPool().query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [newPasswordHash, userId]
      );

      logger.info(`Contraseña actualizada para usuario ${userId}`);

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
      }
      next(error);
    }
  }
}
