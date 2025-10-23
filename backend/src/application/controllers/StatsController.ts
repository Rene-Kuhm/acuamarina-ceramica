import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';

export class StatsController {
  /**
   * Get dashboard statistics (OPTIMIZADO con queries en paralelo)
   * GET /api/v1/stats/dashboard
   */
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      // Ejecutar todas las queries en paralelo para mejor rendimiento
      const [statsQuery, lowStockQuery, recentOrdersQuery, salesByMonthQuery, topProductsQuery] = await Promise.all([
        // General stats - optimizado
        getPool().query(`
          SELECT
            (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
            (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days') as monthly_orders,
            (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days') as monthly_revenue,
            (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers
        `),

        // Low stock products - usa índice
        getPool().query(`
          SELECT id, name, sku, stock_quantity, low_stock_threshold, price
          FROM products
          WHERE stock_quantity <= low_stock_threshold
          AND is_active = true
          ORDER BY stock_quantity ASC
          LIMIT 5
        `),

        // Recent orders - usa índice en created_at
        getPool().query(`
          SELECT o.id, o.order_number, o.status, o.total_amount, o.created_at,
                 u.first_name || ' ' || u.last_name as customer_name
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          ORDER BY o.created_at DESC
          LIMIT 5
        `),

        // Sales by month
        getPool().query(`
          SELECT
            TO_CHAR(created_at, 'YYYY-MM') as month,
            COUNT(*) as orders_count,
            COALESCE(SUM(total_amount), 0) as total_sales
          FROM orders
          WHERE created_at >= NOW() - INTERVAL '6 months'
          GROUP BY TO_CHAR(created_at, 'YYYY-MM')
          ORDER BY month DESC
        `),

        // Top products - productos más vendidos
        getPool().query(`
          SELECT
            p.id,
            p.name,
            p.sku,
            COALESCE(SUM(oi.quantity), 0) as total_sales
          FROM products p
          LEFT JOIN order_items oi ON p.id = oi.product_id
          LEFT JOIN orders o ON oi.order_id = o.id AND o.created_at >= NOW() - INTERVAL '30 days'
          WHERE p.is_active = true
          GROUP BY p.id, p.name, p.sku
          ORDER BY total_sales DESC
          LIMIT 5
        `)
      ]);

      res.json({
        success: true,
        data: {
          stats: statsQuery.rows[0],
          lowStockProducts: lowStockQuery.rows,
          recentOrders: recentOrdersQuery.rows,
          salesByMonth: salesByMonthQuery.rows,
          topProducts: topProductsQuery.rows,
        },
      });
    } catch (error) {
      logger.error('Error al obtener estadísticas:', error);
      next(error);
    }
  }
}
