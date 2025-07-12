'use client';

import { OrderStatus } from '@/types/order';
import {
  ClockIcon,
  CheckCircleIcon,
  PrinterIcon,
  TruckIcon,
  SparklesIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig = {
  [OrderStatus.Pending]: {
    label: 'Chờ xử lý',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  [OrderStatus.Confirmed]: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircleIcon
  },
  [OrderStatus.Printing]: {
    label: 'Đang in',
    color: 'bg-purple-100 text-purple-800',
    icon: PrinterIcon
  },
  [OrderStatus.Shipping]: {
    label: 'Đang giao',
    color: 'bg-indigo-100 text-indigo-800',
    icon: TruckIcon
  },
  [OrderStatus.Completed]: {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-800',
    icon: SparklesIcon
  },
  [OrderStatus.Cancelled]: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  }
};

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <IconComponent className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
