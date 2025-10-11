import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const updateCategorySchema = categorySchema.partial();

export class CategoriesController {
  /**
   * Get all categories
   * GET /api/v1/categories
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { includeInactive } = req.query;

      const whereClause = includeInactive === 'true' ? '' : 'WHERE is_active = true';

      const result = await getPool().query(
        `SELECT
          c.*,
          pc.name as parent_name,
          (SELECT COUNT(*) FROM products WHERE category_id = c.id) as products_count
         FROM categories c
         LEFT JOIN categories pc ON c.parent_id = pc.id
         ${whereClause}
         ORDER BY c.display_order, c.name`
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category by ID
   * GET /api/v1/categories/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPool().query(
        `SELECT
          c.*,
          pc.name as parent_name,
          (SELECT COUNT(*) FROM products WHERE category_id = c.id) as products_count
         FROM categories c
         LEFT JOIN categories pc ON c.parent_id = pc.id
         WHERE c.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      }

      // Get subcategories
      const subcategoriesResult = await getPool().query(
        'SELECT * FROM categories WHERE parent_id = $1 ORDER BY display_order, name',
        [id]
      );

      const category = {
        ...result.rows[0],
        subcategories: subcategoriesResult.rows,
      };

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create category
   * POST /api/v1/categories
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = categorySchema.parse(req.body);
      const userId = (req as any).user?.userId;

      // Generate slug if not provided
      const slug = data.slug || data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const result = await getPool().query(
        `INSERT INTO categories (
          name, slug, description, parent_id, image_url, display_order,
          is_active, meta_title, meta_description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          data.name,
          slug,
          data.description || null,
          data.parentId || null,
          data.imageUrl || null,
          data.displayOrder,
          data.isActive,
          data.metaTitle || null,
          data.metaDescription || null,
        ]
      );

      // Audit log
      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
         VALUES ($1, 'CREATE', 'CATEGORY', $2, $3)`,
        [userId, result.rows[0].id, JSON.stringify(data)]
      );

      logger.info(`Categoría creada: ${data.name} por usuario ${userId}`);

      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
      }

      if ((error as any).code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'El slug ya existe',
        });
      }

      next(error);
    }
  }

  /**
   * Update category
   * PATCH /api/v1/categories/:id
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateCategorySchema.parse(req.body);
      const userId = (req as any).user?.userId;

      const existingCategory = await getPool().query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
      );

      if (existingCategory.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          updates.push(`${snakeKey} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No hay datos para actualizar',
        });
      }

      values.push(id);

      const result = await getPool().query(
        `UPDATE categories
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      // Audit log
      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
         VALUES ($1, 'UPDATE', 'CATEGORY', $2, $3, $4)`,
        [userId, id, JSON.stringify(existingCategory.rows[0]), JSON.stringify(data)]
      );

      logger.info(`Categoría actualizada: ${id} por usuario ${userId}`);

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
      }

      if ((error as any).code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'El slug ya existe',
        });
      }

      next(error);
    }
  }

  /**
   * Delete category
   * DELETE /api/v1/categories/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      // Check if category has products
      const productsCount = await getPool().query(
        'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
        [id]
      );

      if (parseInt(productsCount.rows[0].count) > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar una categoría con productos asociados',
        });
      }

      // Check if category has subcategories
      const subcategoriesCount = await getPool().query(
        'SELECT COUNT(*) as count FROM categories WHERE parent_id = $1',
        [id]
      );

      if (parseInt(subcategoriesCount.rows[0].count) > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar una categoría con subcategorías',
        });
      }

      const result = await getPool().query(
        'DELETE FROM categories WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
      }

      // Audit log
      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
         VALUES ($1, 'DELETE', 'CATEGORY', $2, $3)`,
        [userId, id, JSON.stringify(result.rows[0])]
      );

      logger.info(`Categoría eliminada: ${id} por usuario ${userId}`);

      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
