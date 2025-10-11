import { useQuery } from '@tanstack/react-query';
import { customersService, CustomersResponse, CustomerDetailResponse } from '@/services/customers.service';

export const useCustomers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<CustomersResponse>({
    queryKey: ['customers', params],
    queryFn: () => customersService.getAll(params),
  });
};

export const useCustomer = (id: string) => {
  return useQuery<CustomerDetailResponse>({
    queryKey: ['customer', id],
    queryFn: () => customersService.getById(id),
    enabled: !!id,
  });
};

export const useCustomerOrderHistory = (id: string, params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['customer-orders', id, params],
    queryFn: () => customersService.getOrderHistory(id, params),
    enabled: !!id,
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customer-stats'],
    queryFn: () => customersService.getStats(),
  });
};
