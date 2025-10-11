import { apiClient } from '@/lib/api/client';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  shipping_address: string;
  billing_address: string;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  items_count?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  product_name_current?: string;
  created_at: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: OrderDetail;
}

export interface OrderStatsResponse {
  success: boolean;
  data: OrderStats;
}

export interface UpdateOrderStatusPayload {
  status: Order['status'];
}

export const ordersService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: Order['status'];
    paymentStatus?: Order['payment_status'];
    search?: string;
  }): Promise<OrdersResponse> => {
    return apiClient.get<OrdersResponse>('/orders', { params });
  },

  getById: async (id: string): Promise<OrderDetailResponse> => {
    return apiClient.get<OrderDetailResponse>(`/orders/${id}`);
  },

  updateStatus: async (id: string, payload: UpdateOrderStatusPayload): Promise<{ success: boolean; data: Order }> => {
    return apiClient.patch(`/orders/${id}/status`, payload);
  },

  getStats: async (): Promise<OrderStatsResponse> => {
    return apiClient.get<OrderStatsResponse>('/orders/stats');
  },
};
