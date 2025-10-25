import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';

// Esquemas de validación
const createAddressSchema = z.object({
  label: z.string().max(50).optional(),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').max(20),
  streetAddress: z.string().min(3, 'La dirección debe tener al menos 3 caracteres').max(255),
  streetNumber: z.string().min(1).max(20),
  apartment: z.string().max(50).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(4).max(20),
  country: z.string().max(100).default('Argentina'),
  isDefault: z.boolean().default(false),
});

const updateAddressSchema = createAddressSchema.partial();

export class AddressController {
  /**
   * Get all addresses for the authenticated user
   * GET /api/v1/addresses
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const result = await getPool().query(
        `SELECT
          id, user_id, label, first_name, last_name, phone,
          street_address, street_number, apartment, city, state,
          postal_code, country, is_default, created_at, updated_at
         FROM addresses
         WHERE user_id = $1
         ORDER BY is_default DESC, created_at DESC`,
        [userId]
      );

      // Convert snake_case to camelCase
      const addresses = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        label: row.label,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        streetAddress: row.street_address,
        streetNumber: row.street_number,
        apartment: row.apartment,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        country: row.country,
        isDefault: row.is_default,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      res.json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      logger.error('Error obteniendo direcciones:', error);
      next(error);
    }
  }

  /**
   * Get a single address by ID
   * GET /api/v1/addresses/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const result = await getPool().query(
        `SELECT
          id, user_id, label, first_name, last_name, phone,
          street_address, street_number, apartment, city, state,
          postal_code, country, is_default, created_at, updated_at
         FROM addresses
         WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Dirección no encontrada',
        });
        return;
      }

      const row = result.rows[0];
      const address = {
        id: row.id,
        userId: row.user_id,
        label: row.label,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        streetAddress: row.street_address,
        streetNumber: row.street_number,
        apartment: row.apartment,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        country: row.country,
        isDefault: row.is_default,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      res.json({
        success: true,
        data: address,
      });
    } catch (error) {
      logger.error('Error obteniendo dirección:', error);
      next(error);
    }
  }

  /**
   * Create a new address
   * POST /api/v1/addresses
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const data = createAddressSchema.parse(req.body);

      const pool = getPool();

      // Si es dirección por defecto, quitar el flag de otras direcciones
      if (data.isDefault) {
        await pool.query(
          'UPDATE addresses SET is_default = false WHERE user_id = $1',
          [userId]
        );
      }

      const result = await pool.query(
        `INSERT INTO addresses (
          user_id, label, first_name, last_name, phone,
          street_address, street_number, apartment, city, state,
          postal_code, country, is_default
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING
          id, user_id, label, first_name, last_name, phone,
          street_address, street_number, apartment, city, state,
          postal_code, country, is_default, created_at, updated_at`,
        [
          userId,
          data.label || null,
          data.firstName,
          data.lastName,
          data.phone,
          data.streetAddress,
          data.streetNumber,
          data.apartment || null,
          data.city,
          data.state,
          data.postalCode,
          data.country,
          data.isDefault,
        ]
      );

      const row = result.rows[0];
      const address = {
        id: row.id,
        userId: row.user_id,
        label: row.label,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        streetAddress: row.street_address,
        streetNumber: row.street_number,
        apartment: row.apartment,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        country: row.country,
        isDefault: row.is_default,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      logger.info(`Dirección creada para usuario ${userId}`);

      res.status(201).json({
        success: true,
        data: address,
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
      logger.error('Error creando dirección:', error);
      next(error);
    }
  }

  /**
   * Update an address
   * PUT /api/v1/addresses/:id
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const data = updateAddressSchema.parse(req.body);

      const pool = getPool();

      // Verificar que la dirección existe y pertenece al usuario
      const checkResult = await pool.query(
        'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Dirección no encontrada',
        });
        return;
      }

      // Si se marca como predeterminada, quitar el flag de otras direcciones
      if (data.isDefault) {
        await pool.query(
          'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
          [userId, id]
        );
      }

      // Construir query dinámica
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (data.label !== undefined) {
        updates.push(`label = $${paramCount++}`);
        values.push(data.label);
      }
      if (data.firstName !== undefined) {
        updates.push(`first_name = $${paramCount++}`);
        values.push(data.firstName);
      }
      if (data.lastName !== undefined) {
        updates.push(`last_name = $${paramCount++}`);
        values.push(data.lastName);
      }
      if (data.phone !== undefined) {
        updates.push(`phone = $${paramCount++}`);
        values.push(data.phone);
      }
      if (data.streetAddress !== undefined) {
        updates.push(`street_address = $${paramCount++}`);
        values.push(data.streetAddress);
      }
      if (data.streetNumber !== undefined) {
        updates.push(`street_number = $${paramCount++}`);
        values.push(data.streetNumber);
      }
      if (data.apartment !== undefined) {
        updates.push(`apartment = $${paramCount++}`);
        values.push(data.apartment);
      }
      if (data.city !== undefined) {
        updates.push(`city = $${paramCount++}`);
        values.push(data.city);
      }
      if (data.state !== undefined) {
        updates.push(`state = $${paramCount++}`);
        values.push(data.state);
      }
      if (data.postalCode !== undefined) {
        updates.push(`postal_code = $${paramCount++}`);
        values.push(data.postalCode);
      }
      if (data.country !== undefined) {
        updates.push(`country = $${paramCount++}`);
        values.push(data.country);
      }
      if (data.isDefault !== undefined) {
        updates.push(`is_default = $${paramCount++}`);
        values.push(data.isDefault);
      }

      if (updates.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No hay datos para actualizar',
        });
        return;
      }

      updates.push(`updated_at = NOW()`);
      values.push(id, userId);

      const result = await pool.query(
        `UPDATE addresses
         SET ${updates.join(', ')}
         WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
         RETURNING
          id, user_id, label, first_name, last_name, phone,
          street_address, street_number, apartment, city, state,
          postal_code, country, is_default, created_at, updated_at`,
        values
      );

      const row = result.rows[0];
      const address = {
        id: row.id,
        userId: row.user_id,
        label: row.label,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        streetAddress: row.street_address,
        streetNumber: row.street_number,
        apartment: row.apartment,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        country: row.country,
        isDefault: row.is_default,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      logger.info(`Dirección ${id} actualizada`);

      res.json({
        success: true,
        data: address,
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
      logger.error('Error actualizando dirección:', error);
      next(error);
    }
  }

  /**
   * Delete an address
   * DELETE /api/v1/addresses/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const result = await getPool().query(
        'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Dirección no encontrada',
        });
        return;
      }

      logger.info(`Dirección ${id} eliminada`);

      res.json({
        success: true,
        message: 'Dirección eliminada correctamente',
      });
    } catch (error) {
      logger.error('Error eliminando dirección:', error);
      next(error);
    }
  }

  /**
   * Set an address as default
   * PATCH /api/v1/addresses/:id/set-default
   */
  static async setDefault(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const pool = getPool();

      // Verificar que la dirección existe y pertenece al usuario
      const checkResult = await pool.query(
        'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Dirección no encontrada',
        });
        return;
      }

      // Quitar el flag de todas las direcciones del usuario
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );

      // Marcar esta dirección como predeterminada
      await pool.query(
        'UPDATE addresses SET is_default = true WHERE id = $1',
        [id]
      );

      logger.info(`Dirección ${id} marcada como predeterminada`);

      res.json({
        success: true,
        message: 'Dirección predeterminada actualizada',
      });
    } catch (error) {
      logger.error('Error estableciendo dirección predeterminada:', error);
      next(error);
    }
  }
}
