import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
  search: z.string().optional(),
});

export class OrdersController {
  /**
   * Get all orders with pagination and filters
   * GET /api/v1/orders
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = querySchema.parse(req.query);
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '20');
      const offset = (page - 1) * limit;

      const conditions: string[] = [];
      const params: any[] = [];
      let paramCount = 1;

      if (query.status) {
        conditions.push(`o.status = $${paramCount}`);
        params.push(query.status);
        paramCount++;
      }

      if (query.paymentStatus) {
        conditions.push(`o.payment_status = $${paramCount}`);
        params.push(query.paymentStatus);
        paramCount++;
      }

      if (query.search) {
        conditions.push(`o.order_number ILIKE $${paramCount}`);
        params.push(`%${query.search}%`);
        paramCount++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countResult = await getPool().query(
        `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].total);

      const result = await getPool().query(
        `SELECT o.*,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name,
          (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         ${whereClause}
         ORDER BY o.created_at DESC
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
   * Get order by ID
   * GET /api/v1/orders/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPool().query(
        `SELECT o.*,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name,
          u.phone as customer_phone
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Pedido no encontrado',
        });
      }

      const itemsResult = await getPool().query(
        `SELECT oi.*, p.name as product_name_current
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1
         ORDER BY oi.created_at`,
        [id]
      );

      const order = {
        ...result.rows[0],
        items: itemsResult.rows,
      };

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status
   * PATCH /api/v1/orders/:id/status
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = (req as any).user?.userId;

      if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido',
        });
      }

      const existingOrder = await getPool().query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );

      if (existingOrder.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Pedido no encontrado',
        });
      }

      const updates: any = { status };

      // Update shipped_at when status changes to shipped
      if (status === 'shipped' && existingOrder.rows[0].status !== 'shipped') {
        updates.shipped_at = new Date();
      }

      // Update delivered_at when status changes to delivered
      if (status === 'delivered' && existingOrder.rows[0].status !== 'delivered') {
        updates.delivered_at = new Date();
      }

      const setClause = Object.keys(updates).map((key, idx) =>
        `${key} = $${idx + 1}`
      ).join(', ');

      const values = Object.values(updates);
      values.push(id);

      const result = await getPool().query(
        `UPDATE orders SET ${setClause} WHERE id = $${values.length} RETURNING *`,
        values
      );

      // Audit log
      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
         VALUES ($1, 'UPDATE_STATUS', 'ORDER', $2, $3, $4)`,
        [
          userId,
          id,
          JSON.stringify({ status: existingOrder.rows[0].status }),
          JSON.stringify({ status })
        ]
      );

      logger.info(`Estado de pedido actualizado: ${id} -> ${status} por usuario ${userId}`);

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order statistics
   * GET /api/v1/orders/stats
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getPool().query(`
        SELECT
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as average_order_value
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `);

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
}
