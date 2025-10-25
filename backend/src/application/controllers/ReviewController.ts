import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';

// Esquema de validación para crear reseña
const createReviewSchema = z.object({
  product_id: z.number().int().positive('El ID del producto es requerido'),
  rating: z.number().int().min(1, 'La calificación mínima es 1').max(5, 'La calificación máxima es 5'),
  title: z.string().max(100, 'El título no puede exceder 100 caracteres').optional().or(z.literal('')),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres').max(1000, 'El comentario no puede exceder 1000 caracteres'),
});

// Esquema de validación para actualizar reseña
const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(100).optional().or(z.literal('')),
  comment: z.string().min(10).max(1000).optional(),
});

export class ReviewController {
  /**
   * Obtener reseñas de un producto
   * GET /api/v1/reviews/product/:productId
   */
  static async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.params;

      // Obtener reseñas
      const reviewsResult = await getPool().query(
        `SELECT
          r.id,
          r.user_id,
          r.product_id,
          r.rating,
          r.title,
          r.comment,
          r.verified_purchase,
          r.created_at,
          u.name as user_name,
          u.email as user_email
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.product_id = $1
         ORDER BY r.created_at DESC`,
        [productId]
      );

      // Calcular estadísticas
      const statsResult = await getPool().query(
        `SELECT
          COALESCE(AVG(rating), 0) as average_rating,
          COUNT(*) as total_reviews,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5
         FROM reviews
         WHERE product_id = $1`,
        [productId]
      );

      const stats = statsResult.rows[0];

      res.json({
        success: true,
        data: {
          reviews: reviewsResult.rows.map(row => ({
            id: row.id,
            user_id: row.user_id,
            product_id: row.product_id,
            rating: row.rating,
            title: row.title,
            comment: row.comment,
            verified_purchase: row.verified_purchase,
            created_at: row.created_at,
            user: row.user_name ? {
              id: row.user_id,
              name: row.user_name,
            } : null,
          })),
          average_rating: parseFloat(stats.average_rating),
          total_reviews: parseInt(stats.total_reviews),
          rating_distribution: {
            1: parseInt(stats.rating_1),
            2: parseInt(stats.rating_2),
            3: parseInt(stats.rating_3),
            4: parseInt(stats.rating_4),
            5: parseInt(stats.rating_5),
          },
        },
      });
    } catch (error) {
      logger.error('Error al obtener reseñas:', error);
      next(error);
    }
  }

  /**
   * Crear una reseña
   * POST /api/v1/reviews
   */
  static async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Debes iniciar sesión para dejar una reseña',
        });
        return;
      }

      // Validar datos
      const data = createReviewSchema.parse(req.body);

      // Verificar que el producto existe
      const productResult = await getPool().query(
        'SELECT id FROM products WHERE id = $1',
        [data.product_id]
      );

      if (productResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      // Verificar que el usuario no haya dejado ya una reseña para este producto
      const existingReview = await getPool().query(
        'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2',
        [userId, data.product_id]
      );

      if (existingReview.rows.length > 0) {
        res.status(409).json({
          success: false,
          message: 'Ya has dejado una reseña para este producto',
        });
        return;
      }

      // Verificar si es una compra verificada
      const purchaseResult = await getPool().query(
        `SELECT 1 FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'delivered'
         LIMIT 1`,
        [userId, data.product_id]
      );

      const verifiedPurchase = purchaseResult.rows.length > 0;

      // Crear la reseña
      const result = await getPool().query(
        `INSERT INTO reviews (user_id, product_id, rating, title, comment, verified_purchase)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, data.product_id, data.rating, data.title || null, data.comment, verifiedPurchase]
      );

      const review = result.rows[0];

      // Obtener información del usuario
      const userResult = await getPool().query(
        'SELECT name FROM users WHERE id = $1',
        [userId]
      );

      logger.info(`Nueva reseña creada: ID ${review.id} para producto ${data.product_id}`);

      res.status(201).json({
        success: true,
        data: {
          id: review.id,
          user_id: review.user_id,
          product_id: review.product_id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          verified_purchase: review.verified_purchase,
          created_at: review.created_at,
          user: {
            id: userId,
            name: userResult.rows[0]?.name,
          },
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
      logger.error('Error al crear reseña:', error);
      next(error);
    }
  }

  /**
   * Actualizar una reseña
   * PUT /api/v1/reviews/:id
   */
  static async updateReview(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      // Validar datos
      const data = updateReviewSchema.parse(req.body);

      // Verificar que la reseña existe y pertenece al usuario
      const existingReview = await getPool().query(
        'SELECT * FROM reviews WHERE id = $1',
        [id]
      );

      if (existingReview.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Reseña no encontrada',
        });
        return;
      }

      if (existingReview.rows[0].user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar esta reseña',
        });
        return;
      }

      // Construir query de actualización
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (data.rating !== undefined) {
        updates.push(`rating = $${paramCount++}`);
        values.push(data.rating);
      }
      if (data.title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        values.push(data.title);
      }
      if (data.comment !== undefined) {
        updates.push(`comment = $${paramCount++}`);
        values.push(data.comment);
      }

      if (updates.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No hay datos para actualizar',
        });
        return;
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      // Actualizar
      const result = await getPool().query(
        `UPDATE reviews SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      logger.info(`Reseña actualizada: ID ${id}`);

      res.json({
        success: true,
        data: result.rows[0],
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
      logger.error('Error al actualizar reseña:', error);
      next(error);
    }
  }

  /**
   * Eliminar una reseña
   * DELETE /api/v1/reviews/:id
   */
  static async deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      // Verificar que la reseña existe y pertenece al usuario
      const existingReview = await getPool().query(
        'SELECT user_id FROM reviews WHERE id = $1',
        [id]
      );

      if (existingReview.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Reseña no encontrada',
        });
        return;
      }

      if (existingReview.rows[0].user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar esta reseña',
        });
        return;
      }

      // Eliminar
      await getPool().query('DELETE FROM reviews WHERE id = $1', [id]);

      logger.info(`Reseña eliminada: ID ${id}`);

      res.json({
        success: true,
        message: 'Reseña eliminada correctamente',
      });
    } catch (error) {
      logger.error('Error al eliminar reseña:', error);
      next(error);
    }
  }
}
