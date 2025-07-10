'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';

const statusInfo = {
  [OrderStatus.Pending]: { name: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  [OrderStatus.Confirmed]: { name: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  [OrderStatus.Printing]: { name: 'Đang in', color: 'bg-purple-100 text-purple-800', icon: '🖨️' },
  [OrderStatus.Shipping]: { name: 'Đang giao hàng', color: 'bg-orange-100 text-orange-800', icon: '🚚' },
  [OrderStatus.Completed]: { name: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: '🎉' },
  [OrderStatus.Cancelled]: { name: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: '❌' }
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const orderId = parseInt(params.id as string);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await apiClient.getOrderById(orderId);
      setOrder(orderData);
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setCancelling(true);
      await apiClient.cancelOrder(order.id);
      await fetchOrder(); // Refresh order data
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      alert(err.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem đơn hàng</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-600 mb-8">{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập'}</p>
            <Link
              href="/orders"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              Xem tất cả đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = statusInfo[order.status];
  const canCancel = order.status === OrderStatus.Pending || order.status === OrderStatus.Confirmed;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/orders"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              ← Quay lại danh sách đơn hàng
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đơn hàng #{order.orderNumber}</h1>
              <p className="text-gray-600 mt-1">
                Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.icon} {status.name}
              </span>
              
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm đã đặt</h2>
              
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.designPreviewUrl ? (
                          <img 
                            src={item.designPreviewUrl} 
                            alt={item.designName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">🎨</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.designName}</h3>
                      <p className="text-sm text-gray-600">
                        {item.productName} • {item.sizeWidth}×{item.sizeHeight}cm
                      </p>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-600 mt-1">
                          Ghi chú: {item.specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {item.totalPrice.toLocaleString('vi-VN')}₫
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.unitPrice.toLocaleString('vi-VN')}₫ × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-amber-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Điện thoại:</span>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <span className="text-gray-600">Địa chỉ giao hàng:</span>
                  <p className="font-medium">{order.deliveryAddress}</p>
                </div>
                {order.notes && (
                  <div>
                    <span className="text-gray-600">Ghi chú:</span>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
