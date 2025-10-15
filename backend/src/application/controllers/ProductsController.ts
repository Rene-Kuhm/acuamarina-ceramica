import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';

// Esquemas de validación
const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU es requerido'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  price: z.number().positive('Precio debe ser positivo'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  dimensions: z.string().optional(),
  weight: z.number().positive().optional(),
  material: z.string().optional(),
  finish: z.string().optional(),
  color: z.string().optional(),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial();

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.string().optional(),
  isFeatured: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'created_at', 'createdAt', 'stock_quantity', 'stockQuantity']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export class ProductsController {
  /**
   * Get all products with pagination and filters
   * GET /api/v1/products
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = querySchema.parse(req.query);

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '20');
      const offset = (page - 1) * limit;

      // Convert camelCase to snake_case for SQL
      let sortBy = query.sortBy || 'created_at';
      if (sortBy === 'createdAt') sortBy = 'created_at';
      if (sortBy === 'stockQuantity') sortBy = 'stock_quantity';

      const sortOrder = query.sortOrder || 'desc';

      // Build WHERE clause
      const conditions: string[] = [];
      const params: any[] = [];
      let paramCount = 1;

      if (query.search) {
        conditions.push(`(name ILIKE $${paramCount} OR sku ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
        params.push(`%${query.search}%`);
        paramCount++;
      }

      if (query.categoryId) {
        conditions.push(`category_id = $${paramCount}`);
        params.push(query.categoryId);
        paramCount++;
      }

      if (query.isActive !== undefined) {
        conditions.push(`is_active = $${paramCount}`);
        params.push(query.isActive === 'true');
        paramCount++;
      }

      if (query.isFeatured !== undefined) {
        conditions.push(`is_featured = $${paramCount}`);
        params.push(query.isFeatured === 'true');
        paramCount++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Get total count
      const countResult = await getPool().query(
        `SELECT COUNT(*) as total FROM products ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].total);

      // Get products
      const result = await getPool().query(
        `SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         ${whereClause}
         ORDER BY p.${sortBy} ${sortOrder}
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
        [...params, limit, offset]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Parámetros inválidos',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * Get featured products
   * GET /api/v1/products/destacados
   */
  static async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 12;

      const result = await getPool().query(
        `SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.is_active = true AND p.featured = true
         ORDER BY p.created_at DESC
         LIMIT $1`,
        [limit]
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
   * Get product by ID
   * GET /api/v1/products/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPool().query(
        `SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      // Get product images
      const imagesResult = await getPool().query(
        `SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order, created_at`,
        [id]
      );

      const product = {
        ...result.rows[0],
        images: imagesResult.rows,
      };

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create product
   * POST /api/v1/products
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const userId = (req as any).user?.userId;

      // Generate slug if not provided
      const slug = data.slug || data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const result = await getPool().query(
        `INSERT INTO products (
          sku, name, slug, description, short_description, category_id,
          price, compare_price, cost_price, dimensions, weight, material,
          finish, color, stock_quantity, low_stock_threshold, is_active, is_featured,
          meta_title, meta_description, keywords
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING *`,
        [
          data.sku,
          data.name,
          slug,
          data.description || null,
          data.shortDescription || null,
          data.categoryId || null,
          data.price,
          data.comparePrice || null,
          data.costPrice || null,
          data.dimensions || null,
          data.weight || null,
          data.material || null,
          data.finish || null,
          data.color || null,
          data.stockQuantity,
          data.lowStockThreshold,
          data.isActive,
          data.isFeatured,
          data.metaTitle || null,
          data.metaDescription || null,
          data.keywords || null,
        ]
      );

      // Audit log
      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
         VALUES ($1, 'CREATE', 'PRODUCT', $2, $3)`,
        [userId, result.rows[0].id, JSON.stringify(data)]
      );

      logger.info(`Producto creado: ${data.name} por usuario ${userId}`);

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

      // Check for unique constraint violation
      if ((error as any).code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'El SKU o slug ya existe',
        });
      }

      next(error);
    }
  }

  /**
   * Update product
   * PATCH /api/v1/products/:id
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateProductSchema.parse(req.body);
      const userId = (req as any).user?.userId;

      // Check if product exists
      const existingProduct = await getPool().query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );

      if (existingProduct.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      // Build UPDATE query dynamically
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
        `UPDATE products
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      // Audit log
      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
         VALUES ($1, 'UPDATE', 'PRODUCT', $2, $3, $4)`,
        [userId, id, JSON.stringify(existingProduct.rows[0]), JSON.stringify(data)]
      );

      logger.info(`Producto actualizado: ${id} por usuario ${userId}`);

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
          message: 'El SKU o slug ya existe',
        });
      }

      next(error);
    }
  }

  /**
   * Delete product
   * DELETE /api/v1/products/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      const result = await getPool().query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      // Audit log
      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values)
         VALUES ($1, 'DELETE', 'PRODUCT', $2, $3)`,
        [userId, id, JSON.stringify(result.rows[0])]
      );

      logger.info(`Producto eliminado: ${id} por usuario ${userId}`);

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
