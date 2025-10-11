import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';
import { logger } from '../../shared/utils/logger';

export class ExportController {
  /**
   * Export products to CSV
   * GET /api/v1/export/products
   */
  static async exportProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getPool().query(`
        SELECT
          p.id,
          p.name,
          p.sku,
          p.description,
          c.name as category,
          p.price,
          p.stock_quantity,
          p.low_stock_threshold,
          p.weight,
          p.dimensions,
          p.is_active,
          p.created_at,
          p.updated_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
      `);

      // Generate CSV
      const headers = [
        'ID',
        'Nombre',
        'SKU',
        'Descripción',
        'Categoría',
        'Precio',
        'Stock',
        'Stock Mínimo',
        'Peso',
        'Dimensiones',
        'Activo',
        'Fecha Creación',
        'Fecha Actualización',
      ];

      const csvRows = [headers.join(',')];

      for (const row of result.rows) {
        const values = [
          row.id,
          `"${(row.name || '').replace(/"/g, '""')}"`,
          row.sku || '',
          `"${(row.description || '').replace(/"/g, '""')}"`,
          `"${(row.category || '').replace(/"/g, '""')}"`,
          row.price || 0,
          row.stock_quantity || 0,
          row.low_stock_threshold || 0,
          row.weight || '',
          `"${(row.dimensions || '').replace(/"/g, '""')}"`,
          row.is_active ? 'Sí' : 'No',
          row.created_at ? new Date(row.created_at).toLocaleDateString('es-ES') : '',
          row.updated_at ? new Date(row.updated_at).toLocaleDateString('es-ES') : '',
        ];
        csvRows.push(values.join(','));
      }

      const csv = csvRows.join('\n');
      const filename = `productos_${new Date().toISOString().split('T')[0]}.csv`;

      logger.info(`Productos exportados a CSV: ${result.rows.length} registros`);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

      // Add BOM for Excel UTF-8 support
      res.write('\uFEFF');
      res.end(csv);
    } catch (error) {
      logger.error('Error al exportar productos:', error);
      next(error);
    }
  }

  /**
   * Export orders to CSV
   * GET /api/v1/export/orders
   */
  static async exportOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, status } = req.query;

      let query = `
        SELECT
          o.id,
          o.order_number,
          u.first_name || ' ' || u.last_name as customer_name,
          u.email as customer_email,
          o.status,
          o.payment_status,
          o.payment_method,
          o.subtotal,
          o.tax_amount,
          o.shipping_cost,
          o.discount_amount,
          o.total_amount,
          o.tracking_number,
          o.created_at,
          o.shipped_at,
          o.delivered_at
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramCount = 1;

      if (startDate) {
        query += ` AND o.created_at >= $${paramCount}`;
        params.push(startDate);
        paramCount++;
      }

      if (endDate) {
        query += ` AND o.created_at <= $${paramCount}`;
        params.push(endDate);
        paramCount++;
      }

      if (status) {
        query += ` AND o.status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      query += ' ORDER BY o.created_at DESC';

      const result = await getPool().query(query, params);

      // Generate CSV
      const headers = [
        'ID',
        'Número de Pedido',
        'Cliente',
        'Email',
        'Estado',
        'Estado Pago',
        'Método de Pago',
        'Subtotal',
        'Impuestos',
        'Envío',
        'Descuento',
        'Total',
        'Número de Rastreo',
        'Fecha Pedido',
        'Fecha Envío',
        'Fecha Entrega',
      ];

      const csvRows = [headers.join(',')];

      for (const row of result.rows) {
        const values = [
          row.id,
          row.order_number,
          `"${(row.customer_name || '').replace(/"/g, '""')}"`,
          row.customer_email || '',
          row.status,
          row.payment_status,
          row.payment_method || '',
          row.subtotal || 0,
          row.tax_amount || 0,
          row.shipping_cost || 0,
          row.discount_amount || 0,
          row.total_amount || 0,
          row.tracking_number || '',
          row.created_at ? new Date(row.created_at).toLocaleDateString('es-ES') : '',
          row.shipped_at ? new Date(row.shipped_at).toLocaleDateString('es-ES') : '',
          row.delivered_at ? new Date(row.delivered_at).toLocaleDateString('es-ES') : '',
        ];
        csvRows.push(values.join(','));
      }

      const csv = csvRows.join('\n');
      const filename = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;

      logger.info(`Pedidos exportados a CSV: ${result.rows.length} registros`);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

      // Add BOM for Excel UTF-8 support
      res.write('\uFEFF');
      res.end(csv);
    } catch (error) {
      logger.error('Error al exportar pedidos:', error);
      next(error);
    }
  }

  /**
   * Export customers to CSV
   * GET /api/v1/export/customers
   */
  static async exportCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getPool().query(`
        SELECT
          c.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          c.company_name,
          c.tax_id,
          (SELECT COUNT(*) FROM orders WHERE user_id = c.user_id) as total_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = c.user_id) as total_spent,
          c.created_at
        FROM customers c
        LEFT JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
      `);

      // Generate CSV
      const headers = [
        'ID',
        'Nombre',
        'Apellido',
        'Email',
        'Teléfono',
        'Empresa',
        'RUC/NIT',
        'Total Pedidos',
        'Total Gastado',
        'Fecha Registro',
      ];

      const csvRows = [headers.join(',')];

      for (const row of result.rows) {
        const values = [
          row.id,
          `"${(row.first_name || '').replace(/"/g, '""')}"`,
          `"${(row.last_name || '').replace(/"/g, '""')}"`,
          row.email || '',
          row.phone || '',
          `"${(row.company_name || '').replace(/"/g, '""')}"`,
          row.tax_id || '',
          row.total_orders || 0,
          row.total_spent || 0,
          row.created_at ? new Date(row.created_at).toLocaleDateString('es-ES') : '',
        ];
        csvRows.push(values.join(','));
      }

      const csv = csvRows.join('\n');
      const filename = `clientes_${new Date().toISOString().split('T')[0]}.csv`;

      logger.info(`Clientes exportados a CSV: ${result.rows.length} registros`);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(csv, 'utf8'));

      // Add BOM for Excel UTF-8 support
      res.write('\uFEFF');
      res.end(csv);
    } catch (error) {
      logger.error('Error al exportar clientes:', error);
      next(error);
    }
  }
}
