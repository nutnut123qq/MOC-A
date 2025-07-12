'use client';

import { useState, useRef, useEffect } from 'react';
import { OrderStatus } from '@/types/order';

interface StatusUpdateDropdownProps {
  currentStatus: OrderStatus;
  onStatusUpdate: (newStatus: OrderStatus) => void;
}

export default function StatusUpdateDropdown({ 
  currentStatus, 
  onStatusUpdate 
}: StatusUpdateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    {
      value: OrderStatus.Pending,
      label: 'Chờ duyệt',
      icon: '⏳',
      color: 'text-yellow-600',
      description: 'Đơn hàng chờ admin xác nhận'
    },
    {
      value: OrderStatus.Confirmed,
      label: 'Đã duyệt',
      icon: '✅',
      color: 'text-blue-600',
      description: 'Đơn hàng đã được xác nhận'
    },
    {
      value: OrderStatus.Printing,
      label: 'Đang in',
      icon: '🖨️',
      color: 'text-purple-600',
      description: 'Đang thực hiện in decal'
    },
    {
      value: OrderStatus.Shipping,
      label: 'Đang giao',
      icon: '🚚',
      color: 'text-indigo-600',
      description: 'Đang giao hàng cho khách'
    },
    {
      value: OrderStatus.Completed,
      label: 'Hoàn thành',
      icon: '🎉',
      color: 'text-green-600',
      description: 'Đơn hàng đã hoàn thành'
    },
    {
      value: OrderStatus.Cancelled,
      label: 'Đã hủy',
      icon: '❌',
      color: 'text-red-600',
      description: 'Đơn hàng đã bị hủy'
    }
  ];

  // Get valid next statuses based on current status
  const getValidNextStatuses = (current: OrderStatus): OrderStatus[] => {
    switch (current) {
      case OrderStatus.Pending:
        return [OrderStatus.Confirmed, OrderStatus.Cancelled];
      case OrderStatus.Confirmed:
        return [OrderStatus.Printing, OrderStatus.Cancelled];
      case OrderStatus.Printing:
        return [OrderStatus.Shipping, OrderStatus.Cancelled];
      case OrderStatus.Shipping:
        return [OrderStatus.Completed, OrderStatus.Cancelled];
      case OrderStatus.Completed:
        return []; // No further status changes allowed
      case OrderStatus.Cancelled:
        return []; // No further status changes allowed
      default:
        return [];
    }
  };

  const validNextStatuses = getValidNextStatuses(currentStatus);
  const availableOptions = statusOptions.filter(option => 
    validNextStatuses.includes(option.value)
  );

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng sang "${statusOptions.find(opt => opt.value === newStatus)?.label}"?`
    );

    if (!confirmed) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (availableOptions.length === 0) {
    return (
      <span className="text-gray-400 text-sm">
        Không thể cập nhật
      </span>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Cập nhật trạng thái"
      >
        {isUpdating ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
            Đang cập nhật...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Cập nhật
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Chuyển trạng thái</p>
              <p className="text-xs text-gray-500">Chọn trạng thái mới cho đơn hàng</p>
            </div>
            
            {availableOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusUpdate(option.value)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3 mt-0.5">{option.icon}</span>
                  <div className="flex-1">
                    <div className={`font-medium ${option.color}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
