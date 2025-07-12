'use client';

import { useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';
import StatusUpdateDropdown from './StatusUpdateDropdown';
import CartDesignPreview from '@/components/cart/CartDesignPreview';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
}

export default function OrderDetailsModal({ 
  order, 
  onClose, 
  onStatusUpdate 
}: OrderDetailsModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết đơn hàng {order.orderNumber}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                ID: {order.id} • Tạo lúc {formatDate(order.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-6">
                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Trạng thái đơn hàng</h3>
                  <div className="flex items-center justify-between">
                    <OrderStatusBadge status={order.status} size="lg" />
                    <StatusUpdateDropdown
                      currentStatus={order.status}
                      onStatusUpdate={(newStatus) => onStatusUpdate(order.id, newStatus)}
                    />
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin khách hàng</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tên:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Điện thoại:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin giao hàng</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
                    {order.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Ghi chú: </span>
                        <span className="text-sm text-gray-900">{order.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin thanh toán</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tổng tiền:</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <span className="text-sm font-medium text-green-600">Đã thanh toán</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Sản phẩm ({order.orderItems.length} items)
                </h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        {/* Design Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <CartDesignPreview
                              previewImageUrl={item.designPreviewUrl}
                              designSession={item.designData ? JSON.parse(item.designData) : undefined}
                              designName={item.designName}
                              size="small"
                              className="w-full h-full"
                            />
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.designName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.productName}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Kích thước: {item.sizeWidth}×{item.sizeHeight}cm
                            </div>
                            <div className="text-sm text-gray-600">
                              SL: {item.quantity}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Đơn giá: {formatCurrency(item.unitPrice)}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.totalPrice)}
                            </div>
                          </div>
                          {item.specialInstructions && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Ghi chú: </span>
                              {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              In đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
