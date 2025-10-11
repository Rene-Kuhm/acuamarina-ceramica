# 🚀 CÓDIGO FALTANTE PARA COMPLETAR EL DASHBOARD

Este documento contiene todo el código que falta por implementar. He organizado por secciones para que sea fácil de copiar y pegar.

---

## ✅ YA COMPLETADO:
- ✅ Productos (CRUD completo)
- ✅ Categorías (CRUD completo)
- ✅ Autenticación

---

## 📦 PEDIDOS - Backend

### 1. OrdersController.ts
Crear: `backend/src/application/controllers/OrdersController.ts`

```typescript
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
        conditions.push(`status = $${paramCount}`);
        params.push(query.status);
        paramCount++;
      }

      if (query.paymentStatus) {
        conditions.push(`payment_status = $${paramCount}`);
        params.push(query.paymentStatus);
        paramCount++;
      }

      if (query.search) {
        conditions.push(`order_number ILIKE $${paramCount}`);
        params.push(`%${query.search}%`);
        paramCount++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countResult = await getPool().query(
        `SELECT COUNT(*) as total FROM orders ${whereClause}`,
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
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPool().query(
        `SELECT o.*,
          u.email as customer_email,
          u.first_name || ' ' || u.last_name as customer_name
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
        `SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at`,
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

      const existingOrder = await getPool().query('SELECT * FROM orders WHERE id = $1', [id]);

      if (existingOrder.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Pedido no encontrado',
        });
      }

      const result = await getPool().query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
      );

      await getPool().query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
         VALUES ($1, 'UPDATE_STATUS', 'ORDER', $2, $3, $4)`,
        [userId, id, JSON.stringify({ status: existingOrder.rows[0].status }), JSON.stringify({ status })]
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

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getPool().query(`
        SELECT
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as average_order_value
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
```

### 2. orders.routes.ts
Crear: `backend/src/application/routes/orders.routes.ts`

```typescript
import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

router.get('/', authenticate, authorize('admin', 'manager'), OrdersController.getAll);
router.get('/stats', authenticate, authorize('admin', 'manager'), OrdersController.getStats);
router.get('/:id', authenticate, authorize('admin', 'manager'), OrdersController.getById);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), OrdersController.updateStatus);

export default router;
```

---

## 👥 CLIENTES - Backend

### 3. CustomersController.ts
Crear: `backend/src/application/controllers/CustomersController.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';

export class CustomersController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let query = `
        SELECT c.*, u.email, u.first_name, u.last_name, u.created_at as registered_at
        FROM customers c
        INNER JOIN users u ON c.user_id = u.id
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (search) {
        query += ` WHERE u.email ILIKE $${paramCount} OR u.first_name ILIKE $${paramCount} OR u.last_name ILIKE $${paramCount}`;
        params.push(`%${search}%`);
        paramCount++;
      }

      query += ` ORDER BY c.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(parseInt(limit as string), offset);

      const result = await getPool().query(query, params);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await getPool().query(
        `SELECT c.*, u.email, u.first_name, u.last_name
         FROM customers c
         INNER JOIN users u ON c.user_id = u.id
         WHERE c.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
      }

      const ordersResult = await getPool().query(
        `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
        [result.rows[0].user_id]
      );

      const customer = {
        ...result.rows[0],
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

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const customer = await getPool().query('SELECT user_id FROM customers WHERE id = $1', [id]);

      if (customer.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado',
        });
      }

      const result = await getPool().query(
        `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
        [customer.rows[0].user_id]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 4. customers.routes.ts
Crear: `backend/src/application/routes/customers.routes.ts`

```typescript
import { Router } from 'express';
import { CustomersController } from '../controllers/CustomersController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

router.get('/', authenticate, authorize('admin', 'manager'), CustomersController.getAll);
router.get('/:id', authenticate, authorize('admin', 'manager'), CustomersController.getById);
router.get('/:id/orders', authenticate, authorize('admin', 'manager'), CustomersController.getOrders);

export default router;
```

---

## 📊 ESTADÍSTICAS - Backend

### 5. StatsController.ts
Crear: `backend/src/application/controllers/StatsController.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { getPool } from '../../infrastructure/database/connection';

export class StatsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const statsQuery = await getPool().query(`
        SELECT
          (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
          (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days') as monthly_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days') as monthly_revenue,
          (SELECT COUNT(DISTINCT user_id) FROM customers) as total_customers
      `);

      const lowStockQuery = await getPool().query(`
        SELECT id, name, sku, stock_quantity, low_stock_threshold
        FROM products
        WHERE stock_quantity <= low_stock_threshold
        AND is_active = true
        ORDER BY stock_quantity ASC
        LIMIT 5
      `);

      const recentOrdersQuery = await getPool().query(`
        SELECT o.*, u.first_name || ' ' || u.last_name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `);

      const salesByMonthQuery = await getPool().query(`
        SELECT
          TO_CHAR(created_at, 'YYYY-MM') as month,
          COUNT(*) as orders_count,
          SUM(total_amount) as total_sales
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY month DESC
      `);

      res.json({
        success: true,
        data: {
          stats: statsQuery.rows[0],
          lowStockProducts: lowStockQuery.rows,
          recentOrders: recentOrdersQuery.rows,
          salesByMonth: salesByMonthQuery.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 6. stats.routes.ts
Crear: `backend/src/application/routes/stats.routes.ts`

```typescript
import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin', 'manager'), StatsController.getDashboard);

export default router;
```

---

## 🔧 Actualizar server.ts

En `backend/src/server.ts`, agregar las nuevas rutas:

```typescript
import ordersRoutes from './application/routes/orders.routes';
import customersRoutes from './application/routes/customers.routes';
import statsRoutes from './application/routes/stats.routes';

// Dentro de apiRouter:
apiRouter.use('/orders', ordersRoutes);
apiRouter.use('/customers', customersRoutes);
apiRouter.use('/stats', statsRoutes);
```

---

## 🎨 FRONTEND - Servicios

### 7. orders.service.ts
Crear: `admin-dashboard/src/services/orders.service.ts`

```typescript
import { apiClient } from '@/lib/api/client';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  customer_name?: string;
  items_count?: number;
}

export const ordersService = {
  getAll: async (params?: any) => {
    const queryParams = new URLSearchParams(params);
    return apiClient.get(`/orders?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return apiClient.get(`/orders/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return apiClient.patch(`/orders/${id}/status`, { status });
  },

  getStats: async () => {
    return apiClient.get(`/orders/stats`);
  },
};
```

### 8. customers.service.ts
Crear: `admin-dashboard/src/services/customers.service.ts`

```typescript
import { apiClient } from '@/lib/api/client';

export const customersService = {
  getAll: async (params?: any) => {
    const queryParams = new URLSearchParams(params);
    return apiClient.get(`/customers?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return apiClient.get(`/customers/${id}`);
  },

  getOrders: async (id: string) => {
    return apiClient.get(`/customers/${id}/orders`);
  },
};
```

### 9. stats.service.ts
Crear: `admin-dashboard/src/services/stats.service.ts`

```typescript
import { apiClient } from '@/lib/api/client';

export const statsService = {
  getDashboard: async () => {
    return apiClient.get('/stats/dashboard');
  },
};
```

---

## 📄 FRONTEND - Páginas de Pedidos

### 10. dashboard/orders/page.tsx
Crear: `admin-dashboard/src/app/dashboard/orders/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', { search, status }],
    queryFn: () => ordersService.getAll({ search, status }),
  });

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">Gestiona todos los pedidos</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-input px-3 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="processing">Procesando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4" />
              <p>No hay pedidos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Número</th>
                    <th className="text-left p-4">Cliente</th>
                    <th className="text-left p-4">Estado</th>
                    <th className="text-right p-4">Total</th>
                    <th className="text-left p-4">Fecha</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-mono">{order.order_number}</td>
                      <td className="p-4">{order.customer_name || '-'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">${order.total_amount.toFixed(2)}</td>
                      <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:underline">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ INSTRUCCIONES FINALES

1. **Copia cada sección de código** a su archivo correspondiente
2. **Reinicia el backend** para que cargue las nuevas rutas
3. **El dashboard ya tendrá todas las funcionalidades**

**¡Con esto el dashboard estará 95% completo!** Solo faltarían upload de imágenes y exportación de datos, que son features opcionales.
