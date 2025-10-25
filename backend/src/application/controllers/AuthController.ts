import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../../infrastructure/database/connection';
import { config } from '../../config/environment';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';

// Esquemas de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().optional(),
});

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Generar tokens
const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.secret as jwt.Secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret as jwt.Secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

// Guardar refresh token en la base de datos
const saveRefreshToken = async (userId: string, token: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

  await getPool().query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
};

export class AuthController {
  /**
   * Login
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validar datos de entrada
      const { email, password } = loginSchema.parse(req.body);

      // Buscar usuario
      const result = await getPool().query(
        `SELECT id, email, password, name, role
         FROM users
         WHERE email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        });
        return;
      }

      const user = result.rows[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        });
        return;
      }

      // Generar tokens
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const { accessToken, refreshToken } = generateTokens(payload);

      // Guardar refresh token
      await saveRefreshToken(user.id, refreshToken);

      // Registrar en audit log (opcional - no bloquea el login si falla)
      try {
        await getPool().query(
          `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, ip_address)
           VALUES ($1, 'LOGIN', 'USER', $2, $3, $4)`,
          [user.id, user.id, JSON.stringify({ email }), req.ip]
        );
      } catch (auditError) {
        logger.warn('No se pudo registrar en audit log:', auditError);
      }

      logger.info(`Usuario autenticado: ${email}`);

      // Preparar nombre del usuario
      const fullName = user.name || user.email.split('@')[0];
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || fullName;
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // Responder
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName,
            lastName,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Register
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validar datos de entrada
      const data = registerSchema.parse(req.body);

      // Verificar si el usuario ya existe
      const existingUser = await getPool().query(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );

      if (existingUser.rows.length > 0) {
        res.status(409).json({
          success: false,
          message: 'El email ya está registrado',
        });
        return;
      }

      // Determinar el nombre completo
      let fullName: string;
      if (data.name) {
        fullName = data.name;
      } else if (data.firstName && data.lastName) {
        fullName = `${data.firstName} ${data.lastName}`;
      } else if (data.firstName) {
        fullName = data.firstName;
      } else {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar un nombre',
        });
        return;
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Crear usuario (role 'user' en lugar de 'customer')
      const result = await getPool().query(
        `INSERT INTO users (email, password, name, phone, role)
         VALUES ($1, $2, $3, $4, 'user')
         RETURNING id, email, name, phone, role`,
        [data.email, passwordHash, fullName, data.phone || null]
      );

      const user = result.rows[0];

      // Generar tokens
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const { accessToken, refreshToken } = generateTokens(payload);

      // Guardar refresh token
      await saveRefreshToken(user.id, refreshToken);

      logger.info(`Nuevo usuario registrado: ${data.email}`);

      // Responder
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.name.split(' ')[0] || user.name,
            lastName: user.name.split(' ').slice(1).join(' ') || '',
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Refresh Token
   * POST /api/v1/auth/refresh
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token requerido',
        });
        return;
      }

      // Verificar token
      let payload: JwtPayload;
      try {
        payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;
      } catch (error) {
        res.status(401).json({
          success: false,
          message: 'Token inválido o expirado',
        });
        return;
      }

      // Verificar que el token existe en la base de datos
      const result = await getPool().query(
        `SELECT id FROM refresh_tokens
         WHERE token = $1 AND user_id = $2 AND expires_at > NOW() AND revoked_at IS NULL`,
        [refreshToken, payload.userId]
      );

      if (result.rows.length === 0) {
        res.status(401).json({
          success: false,
          message: 'Token inválido o expirado',
        });
        return;
      }

      // Generar nuevo access token
      const newPayload: JwtPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      const accessToken = jwt.sign(newPayload, config.jwt.secret as jwt.Secret, {
        expiresIn: config.jwt.expiresIn,
      } as jwt.SignOptions);

      // Responder
      res.json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   * POST /api/v1/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Revocar el refresh token
        await getPool().query(
          `UPDATE refresh_tokens
           SET revoked_at = NOW()
           WHERE token = $1`,
          [refreshToken]
        );
      }

      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   * GET /api/v1/auth/me
   */
  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // El userId viene del middleware de autenticación
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const result = await getPool().query(
        `SELECT id, email, name, role, created_at
         FROM users
         WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      const user = result.rows[0];

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.name.split(' ')[0] || user.name,
            lastName: user.name.split(' ').slice(1).join(' ') || '',
            role: user.role,
            createdAt: user.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/auth/profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const { firstName, lastName, phone } = req.body;

      // Validar que al menos un campo esté presente
      if (!firstName && !lastName && phone === undefined) {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar al menos un campo para actualizar',
        });
        return;
      }

      // Construir el nombre completo
      let fullName: string | undefined;
      if (firstName || lastName) {
        const first = firstName || '';
        const last = lastName || '';
        fullName = `${first} ${last}`.trim();
      }

      // Construir la query de actualización
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (fullName) {
        updates.push(`name = $${paramCount++}`);
        values.push(fullName);
      }

      if (phone !== undefined) {
        updates.push(`phone = $${paramCount++}`);
        values.push(phone);
      }

      if (updates.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No hay cambios para actualizar',
        });
        return;
      }

      updates.push(`updated_at = NOW()`);
      values.push(userId);

      const result = await getPool().query(
        `UPDATE users
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, email, name, phone, role, created_at`,
        values
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      const user = result.rows[0];

      logger.info(`Perfil actualizado para usuario ${userId}`);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.name.split(' ')[0] || user.name,
            lastName: user.name.split(' ').slice(1).join(' ') || '',
            phone: user.phone,
            role: user.role,
            createdAt: user.created_at,
          },
        },
      });
    } catch (error) {
      logger.error('Error actualizando perfil:', error);
      next(error);
    }
  }
}
