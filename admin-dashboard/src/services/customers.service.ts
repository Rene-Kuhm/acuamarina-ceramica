import { apiClient } from '@/lib/api/client';

// Backend interfaces (snake_case)
interface BackendCustomer {
  id: string;
  user_id: string;
  company_name?: string;
  tax_id?: string;
  preferences?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  total_orders?: number;
  total_spent?: number;
}

interface BackendAddress {
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

interface BackendOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

interface BackendCustomerDetail extends BackendCustomer {
  addresses: BackendAddress[];
  recent_orders: BackendOrder[];
}

interface BackendCustomerStats {
  total_customers: number;
  new_customers_this_month: number;
  customers_with_orders: number;
  average_customer_value: number;
}

// Frontend interfaces (camelCase)
export interface Customer {
  id: string;
  userId: string;
  companyName?: string;
  taxId?: string;
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface Address {
  id: string;
  userId: string;
  addressType: 'shipping' | 'billing';
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

export interface CustomerDetail extends Customer {
  addresses: Address[];
  recentOrders: Order[];
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  customersWithOrders: number;
  averageCustomerValue: number;
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

// Transformers (snake_case → camelCase)
const transformCustomer = (backend: BackendCustomer): Customer => ({
  id: backend.id,
  userId: backend.user_id,
  companyName: backend.company_name,
  taxId: backend.tax_id,
  preferences: backend.preferences,
  createdAt: backend.created_at,
  updatedAt: backend.updated_at,
  email: backend.email,
  firstName: backend.first_name,
  lastName: backend.last_name,
  phone: backend.phone,
  totalOrders: backend.total_orders,
  totalSpent: backend.total_spent,
});

const transformAddress = (backend: BackendAddress): Address => ({
  id: backend.id,
  userId: backend.user_id,
  addressType: backend.address_type,
  streetAddress: backend.street_address,
  city: backend.city,
  stateProvince: backend.state_province,
  postalCode: backend.postal_code,
  country: backend.country,
  isDefault: backend.is_default,
  createdAt: backend.created_at,
});

const transformOrder = (backend: BackendOrder): Order => ({
  id: backend.id,
  orderNumber: backend.order_number,
  status: backend.status,
  paymentStatus: backend.payment_status,
  totalAmount: backend.total_amount,
  createdAt: backend.created_at,
});

const transformCustomerDetail = (backend: BackendCustomerDetail): CustomerDetail => ({
  ...transformCustomer(backend),
  addresses: backend.addresses.map(transformAddress),
  recentOrders: backend.recent_orders.map(transformOrder),
});

const transformCustomerStats = (backend: BackendCustomerStats): CustomerStats => ({
  totalCustomers: backend.total_customers,
  newCustomersThisMonth: backend.new_customers_this_month,
  customersWithOrders: backend.customers_with_orders,
  averageCustomerValue: backend.average_customer_value,
});

export const customersService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CustomersResponse> => {
    const response = await apiClient.get<{
      success: boolean;
      data: BackendCustomer[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>('/customers', { params });

    return {
      success: response.success,
      data: response.data.map(transformCustomer),
      pagination: response.pagination,
    };
  },

  getById: async (id: string): Promise<CustomerDetailResponse> => {
    const response = await apiClient.get<{
      success: boolean;
      data: BackendCustomerDetail;
    }>(`/customers/${id}`);

    return {
      success: response.success,
      data: transformCustomerDetail(response.data),
    };
  },

  getOrderHistory: async (id: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: Order[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> => {
    const response = await apiClient.get<{
      success: boolean;
      data: BackendOrder[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(`/customers/${id}/orders`, { params });

    return {
      success: response.success,
      data: response.data.map(transformOrder),
      pagination: response.pagination,
    };
  },

  getStats: async (): Promise<CustomerStatsResponse> => {
    const response = await apiClient.get<{
      success: boolean;
      data: BackendCustomerStats;
    }>('/customers/stats');

    return {
      success: response.success,
      data: transformCustomerStats(response.data),
    };
  },
};
