import { apiClient } from '@/lib/api/client';

export interface Customer {
  id: string;
  user_id: string;
  company_name?: string;
  tax_id?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  total_orders?: number;
  total_spent?: number;
}

export interface CustomerDetail extends Customer {
  addresses: Address[];
  recent_orders: Order[];
}

export interface Address {
  id: string;
  user_id: string;
  address_type: 'shipping' | 'billing';
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

export interface CustomerStats {
  total_customers: number;
  new_customers_this_month: number;
  customers_with_orders: number;
  average_customer_value: number;
}

export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerDetailResponse {
  success: boolean;
  data: CustomerDetail;
}

export interface CustomerStatsResponse {
  success: boolean;
  data: CustomerStats;
}

export const customersService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CustomersResponse> => {
    return apiClient.get<CustomersResponse>('/customers', { params });
  },

  getById: async (id: string): Promise<CustomerDetailResponse> => {
    return apiClient.get<CustomerDetailResponse>(`/customers/${id}`);
  },

  getOrderHistory: async (id: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: Order[]; pagination: any }> => {
    return apiClient.get(`/customers/${id}/orders`, { params });
  },

  getStats: async (): Promise<CustomerStatsResponse> => {
    return apiClient.get<CustomerStatsResponse>('/customers/stats');
  },
};
