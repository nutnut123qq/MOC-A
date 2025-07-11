import { ProductType } from './product';

export enum OrderStatus {
  Pending = 1,
  Confirmed = 2,
  Printing = 3,
  Shipping = 4,
  Completed = 5,
  Cancelled = 6
}

export enum PaymentStatus {
  Pending = 1,
  Paid = 2,
  Failed = 3,
  Refunded = 4
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  notes: string;
  totalAmount: number;
  status: OrderStatus;
  statusName: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  completedAt?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  designId: number;
  productId: number;
  sizeWidth: number;
  sizeHeight: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions: string;
  designName: string;
  designPreviewUrl: string;
  designData: string; // JSON design session
  productName: string;
  productType: ProductType;
}

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  notes: string;
  orderItems: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  designId: number;
  productId: number;
  sizeWidth: number;
  sizeHeight: number;
  quantity: number;
  specialInstructions: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  statusName: string;
  timestamp: string;
  isCompleted: boolean;
  description: string;
}

export interface CartItem {
  id: number;
  designId: number;
  designName: string;
  designPreviewUrl: string;
  designData: string; // JSON design session
  productId: number;
  productName: string;
  productType: ProductType;
  sizeWidth: number;
  sizeHeight: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions: string;
  addedAt: string;
}

export interface AddToCartDto {
  designId: number;
  productId: number;
  sizeWidth: number;
  sizeHeight: number;
  quantity: number;
  specialInstructions: string;
}

export interface UpdateCartItemDto {
  quantity: number;
  specialInstructions: string;
}
