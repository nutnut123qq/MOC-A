'use client';

import { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const statusConfig = {
    [OrderStatus.Pending]: {
      label: 'Chờ duyệt',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳',
      dotColor: 'bg-yellow-400'
    },
    [OrderStatus.Confirmed]: {
      label: 'Đã duyệt',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '✅',
      dotColor: 'bg-blue-400'
    },
    [OrderStatus.Printing]: {
      label: 'Đang in',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: '🖨️',
      dotColor: 'bg-purple-400'
    },
    [OrderStatus.Shipping]: {
      label: 'Đang giao',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: '🚚',
      dotColor: 'bg-indigo-400'
    },
    [OrderStatus.Completed]: {
      label: 'Hoàn thành',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🎉',
      dotColor: 'bg-green-400'
    },
    [OrderStatus.Cancelled]: {
      label: 'Đã hủy',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '❌',
      dotColor: 'bg-red-400'
    }
  };

  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${config.color}
      ${sizeClasses[size]}
    `}>
      <span className={`
        rounded-full mr-2 animate-pulse
        ${config.dotColor}
        ${dotSizeClasses[size]}
      `}></span>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}
