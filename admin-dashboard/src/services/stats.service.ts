import { apiClient } from '@/lib/api/client';

export interface DashboardStats {
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
}

export const statsService = {
  getDashboard: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/stats/dashboard');
  },
};
