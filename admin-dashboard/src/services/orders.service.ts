import { apiClient } from '@/lib/api/client';
import { Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod } from '@/types';

// Backend response types (snake_case)
interface BackendOrder {
  id: string;
  order_number: string;
  user_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  subtotal?: number;
  discount_amount?: number;
  tax_amount?: number;
  shipping_cost?: number;
  total_amount: number;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_phone?: string;
  shipping_street_address?: string;
  shipping_street_number?: string;
  shipping_apartment?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  customer_notes?: string;
  admin_notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items_count?: number;
}

interface BackendOrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_sku?: string;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

interface BackendOrderDetail extends BackendOrder {
  items: BackendOrderItem[];
}

// Transform functions
const transformOrderItem = (item: BackendOrderItem): OrderItem => ({
  id: item.id,
  orderId: item.order_id,
  productId: item.product_id,
  productName: item.product_name,
  productSku: item.product_sku,
  productImageUrl: item.product_image_url,
  quantity: item.quantity,
  unitPrice: item.unit_price,
  totalPrice: item.total_price,
  createdAt: item.created_at,
});

const mapToOrderStatus = (status: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    'pending': OrderStatus.PENDING,
    'confirmed': OrderStatus.CONFIRMED,
    'processing': OrderStatus.PROCESSING,
    'shipped': OrderStatus.SHIPPED,
    'delivered': OrderStatus.DELIVERED,
    'cancelled': OrderStatus.CANCELLED,
  };
  return statusMap[status] || OrderStatus.PENDING;
};

const mapToPaymentStatus = (status: string): PaymentStatus => {
  const statusMap: Record<string, PaymentStatus> = {
    'pending': PaymentStatus.PENDING,
    'completed': PaymentStatus.COMPLETED,
    'failed': PaymentStatus.FAILED,
    'refunded': PaymentStatus.REFUNDED,
  };
  return statusMap[status] || PaymentStatus.PENDING;
};

const mapToPaymentMethod = (method: string | undefined): PaymentMethod | undefined => {
  if (!method) return undefined;
  const methodMap: Record<string, PaymentMethod> = {
    'cash': PaymentMethod.CASH,
    'card': PaymentMethod.CARD,
    'transfer': PaymentMethod.TRANSFER,
    'mercadopago': PaymentMethod.MERCADOPAGO,
  };
  return methodMap[method];
};

const transformOrder = (order: BackendOrder): Order => ({
  id: order.id,
  orderNumber: order.order_number,
  userId: order.user_id,
  status: mapToOrderStatus(order.status),
  paymentStatus: mapToPaymentStatus(order.payment_status),
  paymentMethod: mapToPaymentMethod(order.payment_method),
  subtotal: order.subtotal || 0,
  discountAmount: order.discount_amount || 0,
  taxAmount: order.tax_amount || 0,
  shippingCost: order.shipping_cost || 0,
  totalAmount: order.total_amount,
  shippingFirstName: order.shipping_first_name,
  shippingLastName: order.shipping_last_name,
  shippingPhone: order.shipping_phone,
  shippingStreetAddress: order.shipping_street_address,
  shippingStreetNumber: order.shipping_street_number,
  shippingApartment: order.shipping_apartment,
  shippingCity: order.shipping_city,
  shippingState: order.shipping_state,
  shippingPostalCode: order.shipping_postal_code,
  shippingCountry: order.shipping_country,
  customerNotes: order.customer_notes,
  adminNotes: order.admin_notes,
  trackingNumber: order.tracking_number,
  shippedAt: order.shipped_at,
  deliveredAt: order.delivered_at,
  createdAt: order.created_at,
  updatedAt: order.updated_at,
});

const transformOrderDetail = (detail: BackendOrderDetail): OrderDetail => ({
  ...transformOrder(detail),
  items: detail.items.map(transformOrderItem),
});

// Backend stats interface
interface BackendOrderStats {
  total_orders: number;
  pending_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  average_order_value: number;
}

// Backend response interfaces
interface BackendOrdersResponse {
  success: boolean;
  data: BackendOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface BackendOrderDetailResponse {
  success: boolean;
  data: BackendOrderDetail;
}

interface BackendOrderStatsResponse {
  success: boolean;
  data: BackendOrderStats;
}

// Frontend response interfaces
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

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrderStatsResponse {
  success: boolean;
  data: OrderStats;
}

export interface UpdateOrderStatusPayload {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// Transform stats
const transformOrderStats = (stats: BackendOrderStats): OrderStats => ({
  totalOrders: stats.total_orders,
  pendingOrders: stats.pending_orders,
  deliveredOrders: stats.delivered_orders,
  cancelledOrders: stats.cancelled_orders,
  totalRevenue: stats.total_revenue,
  averageOrderValue: stats.average_order_value,
});

export const ordersService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
  }): Promise<OrdersResponse> => {
    const response = await apiClient.get<BackendOrdersResponse>('/orders', { params });
    return {
      ...response,
      data: response.data.map(transformOrder),
    };
  },

  getById: async (id: string): Promise<OrderDetailResponse> => {
    const response = await apiClient.get<BackendOrderDetailResponse>(`/orders/${id}`);
    return {
      ...response,
      data: transformOrderDetail(response.data),
    };
  },

  updateStatus: async (id: string, payload: UpdateOrderStatusPayload): Promise<{ success: boolean; data: Order }> => {
    const response = await apiClient.patch<{ success: boolean; data: BackendOrder }>(`/orders/${id}/status`, payload);
    return {
      ...response,
      data: transformOrder(response.data),
    };
  },

  getStats: async (): Promise<OrderStatsResponse> => {
    const response = await apiClient.get<BackendOrderStatsResponse>('/orders/stats');
    return {
      ...response,
      data: transformOrderStats(response.data),
    };
  },
};
