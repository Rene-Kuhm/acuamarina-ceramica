import { apiClient } from '@/lib/api/client';

// Backend interface (snake_case)
interface BackendDashboardStats {
  stats: {
    total_products: number;
    monthly_orders: number;
    monthly_revenue: number;
    total_customers: number;
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    stock_quantity: number;
    low_stock_threshold: number;
    price: number;
  }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    customer_name: string;
  }>;
  salesByMonth: Array<{
    month: string;
    orders_count: number;
    total_sales: number;
  }>;
  topProducts?: Array<{
    id: string;
    name: string;
    sku: string;
    totalSales: number;
    revenue: number;
  }>;
}

// Frontend interface (camelCase)
export interface DashboardStats {
  stats: {
    totalProducts: number;
    monthlyOrders: number;
    monthlyRevenue: number;
    totalCustomers: number;
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
    price: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    customerName: string;
  }>;
  salesByMonth: Array<{
    month: string;
    ordersCount: number;
    totalSales: number;
  }>;
  topProducts?: Array<{
    id: string;
    name: string;
    sku: string;
    totalSales: number;
    revenue: number;
  }>;
}

// Transform backend (snake_case) to frontend (camelCase)
const transformDashboardStats = (backend: BackendDashboardStats): DashboardStats => ({
  stats: {
    totalProducts: backend.stats.total_products,
    monthlyOrders: backend.stats.monthly_orders,
    monthlyRevenue: backend.stats.monthly_revenue,
    totalCustomers: backend.stats.total_customers,
  },
  lowStockProducts: backend.lowStockProducts.map(product => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    stockQuantity: product.stock_quantity,
    lowStockThreshold: product.low_stock_threshold,
    price: product.price,
  })),
  recentOrders: backend.recentOrders.map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    totalAmount: order.total_amount,
    createdAt: order.created_at,
    customerName: order.customer_name,
  })),
  salesByMonth: backend.salesByMonth.map(month => ({
    month: month.month,
    ordersCount: month.orders_count,
    totalSales: month.total_sales,
  })),
  topProducts: backend.topProducts?.map(product => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    totalSales: product.totalSales,
    revenue: product.revenue,
  })),
});

export const statsService = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<BackendDashboardStats>('/stats/dashboard');
    return transformDashboardStats(response);
  },
};
