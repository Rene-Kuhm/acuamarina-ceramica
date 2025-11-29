import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});

export class CustomersController {
  /**
   * Get all customers with pagination and filters
   * GET /api/v1/customers
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

      if (query.search) {
        conditions.push(`(u.email ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`);
        params.push(`%${query.search}%`);
        paramCount++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countResult = await getPool().query(
        `SELECT COUNT(*) as total
         FROM customers c
         LEFT JOIN users u ON c.user_id = u.id
         ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].total);

      const result = await getPool().query(
        `SELECT c.*,
          u.email,
          u.name,
          u.phone,
          (SELECT COUNT(*) FROM orders WHERE user_id = c.user_id) as total_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = c.user_id) as total_spent
         FROM customers c
         LEFT JOIN users u ON c.user_id = u.id
         ${whereClause}
         ORDER BY c.created_at DESC
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
   * Get customer by ID
   * GET /api/v1/customers/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPool().query(
        `SELECT c.*,
          u.email,
          u.name,
          u.phone,
          u.created_at as user_created_at
         FROM customers c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
      }

      // Get customer addresses
      const addressesResult = await getPool().query(
        `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
        [result.rows[0].user_id]
      );

      // Get customer orders
      const ordersResult = await getPool().query(
        `SELECT id, order_number, status, payment_status, total_amount, created_at
         FROM orders
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [result.rows[0].user_id]
      );

      const customer = {
        ...result.rows[0],
        addresses: addressesResult.rows,
        recent_orders: ordersResult.rows,
      };

      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get customer statistics
   * GET /api/v1/customers/stats
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getPool().query(`
        SELECT
          COUNT(DISTINCT c.id) as total_customers,
          COUNT(CASE WHEN c.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_customers_this_month,
          COUNT(CASE WHEN EXISTS (
            SELECT 1 FROM orders WHERE user_id = c.user_id
          ) THEN 1 END) as customers_with_orders,
          COALESCE(AVG(order_stats.total_spent), 0) as average_customer_value
        FROM customers c
        LEFT JOIN (
          SELECT user_id, SUM(total_amount) as total_spent
          FROM orders
          GROUP BY user_id
        ) order_stats ON c.user_id = order_stats.user_id
      `);

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get customer order history
   * GET /api/v1/customers/:id/orders
   */
  static async getOrderHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '10');
      const offset = (page - 1) * limit;

      // Get customer to verify exists
      const customerResult = await getPool().query(
        'SELECT user_id FROM customers WHERE id = $1',
        [id]
      );

      if (customerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
      }

      const userId = customerResult.rows[0].user_id;

      const countResult = await getPool().query(
        'SELECT COUNT(*) as total FROM orders WHERE user_id = $1',
        [userId]
      );
      const total = parseInt(countResult.rows[0].total);

      const ordersResult = await getPool().query(
        `SELECT o.*,
          (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
         FROM orders o
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      res.json({
        success: true,
        data: ordersResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
