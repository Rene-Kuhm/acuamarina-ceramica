import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';
import { transformProductToAPI } from '../../shared/utils/caseConverter';

// Esquemas de validación
const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU es requerido'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  categoryId: z.preprocess(
    // Preprocesar: convertir valores vacíos/inválidos a null, UUIDs válidos se mantienen
    (val) => {
      // Si es undefined, mantenerlo como undefined (no se incluirá en partial)
      if (val === undefined) return undefined;
      // Si es null, vacío o string inválido, retornar null
      if (val === null || val === '' || val === 'undefined' || val === 'null') return null;
      // Si es un UUID válido, retornarlo
      if (typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)) {
        return val;
      }
      // Cualquier otro caso, null
      return null;
    },
    z.string().uuid().nullable()
  ),
  price: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseFloat(val) : val).refine(val => val >= 0, 'Precio no puede ser negativo'),
  comparePrice: z.union([z.number(), z.string()])
    .transform(val => {
      if (!val || val === '') return null;
      return typeof val === 'string' ? parseFloat(val) : val;
    })
    .refine(val => val === null || val > 0, 'Precio de comparación debe ser positivo')
    .optional().nullable(),
  costPrice: z.union([z.number(), z.string()])
    .transform(val => {
      if (!val || val === '') return null;
      return typeof val === 'string' ? parseFloat(val) : val;
    })
    .refine(val => val === null || val > 0, 'Precio de costo debe ser positivo')
    .optional().nullable(),
  dimensions: z.string().optional().nullable(),
  weight: z.union([z.number(), z.string()])
    .transform(val => {
      if (!val || val === '') return null;
      return typeof val === 'string' ? parseFloat(val) : val;
    })
    .refine(val => val === null || val > 0, 'Peso debe ser positivo')
    .optional().nullable(),
  material: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  stockQuantity: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseInt(val) : val).refine(val => val >= 0, 'Stock debe ser mayor o igual a 0').default(0),
  lowStockThreshold: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseInt(val) : val).refine(val => val >= 0, 'Umbral de stock bajo debe ser mayor o igual a 0').default(5),
  isActive: z.union([z.boolean(), z.string()]).transform(val => typeof val === 'string' ? val === 'true' : val).default(true),
  isFeatured: z.union([z.boolean(), z.string()]).transform(val => typeof val === 'string' ? val === 'true' : val).default(false),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  // images se maneja por separado en product_images table
  images: z.array(z.string()).optional(),
});

// Campos que NO deben ir al UPDATE de la tabla products (se manejan por separado)
const EXCLUDED_FROM_UPDATE = ['images'];

// Campos que son JSONB en la base de datos
const JSONB_FIELDS = ['dimensions', 'specifications', 'tags'];

// Convertir valor a JSONB válido
const toJsonb = (value: any): any => {
  if (value === null || value === undefined) return null;
  if (value === '') return null; // String vacío -> null
  if (typeof value === 'object') return JSON.stringify(value);
  // Si es string, intentar parsearlo como JSON, si falla retornar como objeto
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return value; // Ya es JSON válido
    } catch {
      return JSON.stringify({ value }); // Convertir a objeto JSON
    }
  }
  return JSON.stringify(value);
};

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
          c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         ${whereClause}
         ORDER BY p.${sortBy} ${sortOrder}
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
        [...params, limit, offset]
      );

      // Get images for all products
      const productIds = result.rows.map(p => p.id);
      let imagesMap: { [key: number]: string[] } = {};

      if (productIds.length > 0) {
        const imagesResult = await getPool().query(
          `SELECT product_id, url FROM product_images
           WHERE product_id = ANY($1)
           ORDER BY is_primary DESC, display_order, created_at`,
          [productIds]
        );

        // Group images by product_id
        imagesResult.rows.forEach(img => {
          if (!imagesMap[img.product_id]) {
            imagesMap[img.product_id] = [];
          }
          imagesMap[img.product_id].push(img.url);
        });
      }

      // Transform products to match frontend expectations (camelCase)
      const transformedProducts = result.rows.map(product =>
        transformProductToAPI(product, imagesMap[product.id] || [])
      );

      res.json({
        success: true,
        data: transformedProducts,
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

      // Try to get featured products first
      let result = await getPool().query(
        `SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.is_active = true AND p.is_featured = true
         ORDER BY p.created_at DESC
         LIMIT $1`,
        [limit]
      );

      // If no featured products, get most recent active products as fallback
      if (result.rows.length === 0) {
        result = await getPool().query(
          `SELECT
            p.*,
            c.name as category_name,
            c.slug as category_slug
           FROM products p
           LEFT JOIN categories c ON p.category_id = c.id
           WHERE p.is_active = true
           ORDER BY p.created_at DESC
           LIMIT $1`,
          [limit]
        );
      }

      // Get images for all products
      const productIds = result.rows.map(p => p.id);
      let imagesMap: { [key: number]: string[] } = {};

      if (productIds.length > 0) {
        const imagesResult = await getPool().query(
          `SELECT product_id, url FROM product_images
           WHERE product_id = ANY($1)
           ORDER BY is_primary DESC, display_order, created_at`,
          [productIds]
        );

        // Group images by product_id
        imagesResult.rows.forEach(img => {
          if (!imagesMap[img.product_id]) {
            imagesMap[img.product_id] = [];
          }
          imagesMap[img.product_id].push(img.url);
        });
      }

      // Transform products to match frontend expectations (camelCase)
      const transformedProducts = result.rows.map(product =>
        transformProductToAPI(product, imagesMap[product.id] || [])
      );

      res.json({
        success: true,
        data: transformedProducts,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID or Slug
   * GET /api/v1/products/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check if it's a numeric ID, UUID, or slug
      const isNumeric = /^\d+$/.test(id);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      let whereClause: string;
      let paramValue: any;

      if (isNumeric) {
        // It's a numeric ID
        whereClause = 'p.id = $1';
        paramValue = parseInt(id);
      } else if (isUUID) {
        // It's a UUID (for future compatibility)
        whereClause = 'p.id = $1';
        paramValue = id;
      } else {
        // It's a slug
        whereClause = 'p.slug = $1';
        paramValue = id;
      }

      const result = await getPool().query(
        `SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE ${whereClause}`,
        [paramValue]
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
        [result.rows[0].id]
      );

      const productData = result.rows[0];
      const images = imagesResult.rows.map(img => img.url);

      // Transform response to match frontend expectations (camelCase)
      const product = transformProductToAPI(productData, images);

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
      logger.info('📦 Creando producto...');
      logger.info('📝 Datos recibidos:', JSON.stringify(req.body, null, 2));

      const data = createProductSchema.parse(req.body);
      logger.info('✅ Validación exitosa');

      const userId = (req as any).user?.userId;
      logger.info(`👤 Usuario: ${userId}`);

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

      logger.info(`✅ Producto creado: ${data.name} (ID: ${result.rows[0].id}) por usuario ${userId}`);

      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      logger.error('❌ Error al crear producto:', error);

      if (error instanceof z.ZodError) {
        logger.error('Errores de validación:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        });
      }

      // Check for unique constraint violation
      if ((error as any).code === '23505') {
        logger.error('Error: SKU o slug duplicado');
        return res.status(409).json({
          success: false,
          message: 'El SKU o slug ya existe',
        });
      }

      logger.error('Error desconocido:', error instanceof Error ? error.message : 'Unknown error');
      logger.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');

      return res.status(500).json({
        success: false,
        message: 'Error al crear el producto',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * Update product
   * PATCH /api/v1/products/:id
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info(`📝 Actualizando producto ${id}`);
      logger.info(`📦 Body categoryId: ${JSON.stringify(req.body?.categoryId)} (tipo: ${typeof req.body?.categoryId})`);

      const data = updateProductSchema.parse(req.body);
      const userId = (req as any).user?.userId;

      // Extraer images para manejar por separado (NO debe ir al UPDATE de products)
      const { images, ...productData } = data;

      logger.info(`✅ Después de Zod - categoryId: ${JSON.stringify(productData.categoryId)} (tipo: ${typeof productData.categoryId})`);
      logger.info(`✅ productData keys: ${Object.keys(productData).join(', ')}`);

      logger.info('🔍 Buscando producto existente...');

      // Check if product exists
      const existingProduct = await getPool().query(
        'SELECT id, name, sku FROM products WHERE id = $1',
        [id]
      );

      logger.info('✅ Producto encontrado:', existingProduct.rows[0]?.name || 'NO');

      if (existingProduct.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      // Build UPDATE query dynamically (excluyendo images que ya extrajimos)
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      Object.entries(productData).forEach(([key, value]) => {
        // Incluir valores que no son undefined (null ES válido para quitar categoría)
        if (value !== undefined) {
          const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

          // Manejar campos JSONB especialmente
          if (JSONB_FIELDS.includes(key)) {
            const jsonValue = toJsonb(value);
            if (jsonValue !== null) {
              updates.push(`${snakeKey} = $${paramCount}::jsonb`);
              values.push(jsonValue);
              paramCount++;
            }
          } else {
            // Para strings vacíos en campos opcionales, convertir a null
            let finalValue = value;
            if (value === '' && ['material', 'finish', 'color', 'shortDescription', 'metaTitle', 'metaDescription', 'keywords', 'categoryId'].includes(key)) {
              finalValue = null;
            }

            updates.push(`${snakeKey} = $${paramCount}`);
            values.push(finalValue);
            paramCount++;
          }
        }
      });

      // Si no hay nada que actualizar, retornar el producto existente
      if (updates.length === 0 && (!images || images.length === 0)) {
        logger.info('⚠️ No hay cambios, retornando producto existente');
        const fullProduct = await getPool().query(
          'SELECT * FROM products WHERE id = $1',
          [id]
        );
        return res.json({
          success: true,
          data: fullProduct.rows[0],
          message: 'No se detectaron cambios',
        });
      }

      let updatedProduct = existingProduct.rows[0];

      // Solo hacer UPDATE si hay campos para actualizar
      if (updates.length > 0) {
        values.push(id);
        const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        logger.info('📝 Ejecutando query UPDATE...');

        const result = await getPool().query(query, values);
        updatedProduct = result.rows[0];
        logger.info('✅ UPDATE exitoso');
      }

      // Actualizar imágenes si se proporcionaron
      if (images && Array.isArray(images) && images.length > 0) {
        // Eliminar imágenes existentes
        await getPool().query('DELETE FROM product_images WHERE product_id = $1', [id]);

        // Insertar nuevas imágenes
        for (let i = 0; i < images.length; i++) {
          await getPool().query(
            `INSERT INTO product_images (product_id, url, display_order, is_primary)
             VALUES ($1, $2, $3, $4)`,
            [id, images[i], i, i === 0]
          );
        }
        logger.info(`📸 ${images.length} imágenes actualizadas para producto ${id}`);
      }

      // Obtener producto actualizado con imágenes
      const finalProduct = await getPool().query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = $1`,
        [id]
      );

      // Obtener imágenes del producto
      const productImages = await getPool().query(
        `SELECT url FROM product_images WHERE product_id = $1 ORDER BY display_order`,
        [id]
      );

      logger.info(`✅ Producto actualizado: ${id} por usuario ${userId}`);

      res.json({
        success: true,
        data: {
          ...finalProduct.rows[0],
          images: productImages.rows.map(img => img.url),
        },
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

      // Log detallado del error para debugging
      logger.error('❌ Error al actualizar producto:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any).code,
      });

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
