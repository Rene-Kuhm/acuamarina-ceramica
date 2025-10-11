export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  MERCADOPAGO = 'mercadopago',
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;

  // Estado
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  // Totales
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;

  // Información de envío
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingPhone?: string;
  shippingStreetAddress?: string;
  shippingStreetNumber?: string;
  shippingApartment?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;

  // Notas
  customerNotes?: string;
  adminNotes?: string;

  // Tracking
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productSku?: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export interface CreateOrderDTO {
  userId?: string;
  items: CreateOrderItemDTO[];
  shippingAddress: ShippingAddressDTO;
  paymentMethod?: PaymentMethod;
  customerNotes?: string;
  shippingCost?: number;
}

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
}

export interface ShippingAddressDTO {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  streetNumber: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface UpdateOrderStatusDTO {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  adminNotes?: string;
}
