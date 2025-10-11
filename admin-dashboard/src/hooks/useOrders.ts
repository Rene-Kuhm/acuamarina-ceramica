import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService, Order, OrdersResponse, OrderDetailResponse } from '@/services/orders.service';
import { toast } from 'sonner';

export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: Order['status'];
  paymentStatus?: Order['payment_status'];
  search?: string;
}) => {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', params],
    queryFn: () => ordersService.getAll(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery<OrderDetailResponse>({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      ordersService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Estado del pedido actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar el estado del pedido');
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['order-stats'],
    queryFn: () => ordersService.getStats(),
  });
};
