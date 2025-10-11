import { apiClient } from '@/lib/api/client';
import { DashboardStats } from '@/types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },

  getLowStockProducts: async () => {
    return apiClient.get('/dashboard/products/low-stock');
  },

  getRecentOrders: async (limit: number = 10) => {
    return apiClient.get(`/dashboard/orders/recent?limit=${limit}`);
  },
};
