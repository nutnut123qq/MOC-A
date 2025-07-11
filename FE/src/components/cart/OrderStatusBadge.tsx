'use client';

import { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig = {
  [OrderStatus.Pending]: {
    label: 'Chờ xử lý',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳'
  },
  [OrderStatus.Confirmed]: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅'
  },
  [OrderStatus.Printing]: {
    label: 'Đang in',
    color: 'bg-purple-100 text-purple-800',
    icon: '🖨️'
  },
  [OrderStatus.Shipping]: {
    label: 'Đang giao',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🚚'
  },
  [OrderStatus.Completed]: {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-800',
    icon: '🎉'
  },
  [OrderStatus.Cancelled]: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: '❌'
  }
};

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
