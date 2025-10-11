import { Order, OrderItem, CreateOrderDTO, UpdateOrderStatusDTO, OrderStatus, PaymentStatus } from '../entities/Order';

export interface IOrderRepository {
  create(data: CreateOrderDTO): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Order[]>;
  findAll(filters?: OrderFilters): Promise<Order[]>;
  update(id: string, data: UpdateOrderStatusDTO): Promise<Order>;
  delete(id: string): Promise<void>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  count(filters?: OrderFilters): Promise<number>;
}

export interface OrderFilters {
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}
