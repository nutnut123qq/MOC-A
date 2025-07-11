'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';
import CartDesignPreview from '@/components/cart/CartDesignPreview';
import OrderProgressIndicator from '@/components/orders/OrderProgressIndicator';

const statusInfo = {
  [OrderStatus.Pending]: { name: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  [OrderStatus.Confirmed]: { name: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  [OrderStatus.Printing]: { name: 'Đang in', color: 'bg-purple-100 text-purple-800', icon: '🖨️' },
  [OrderStatus.Shipping]: { name: 'Đang giao hàng', color: 'bg-orange-100 text-orange-800', icon: '🚚' },
  [OrderStatus.Completed]: { name: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: '🎉' },
  [OrderStatus.Cancelled]: { name: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: '❌' }
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await apiClient.getMyOrders();
      setOrders(ordersData);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
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
            <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-1">Theo dõi trạng thái và lịch sử đơn hàng</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          /* No Orders */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-600 mb-8">Hãy thiết kế và đặt hàng sản phẩm đầu tiên của bạn</p>
            <Link
              href="/design"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              Bắt đầu thiết kế
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusInfo[order.status];
              
              return (
                <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.icon} {status.name}
                      </span>
                      
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.orderItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-15 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            <CartDesignPreview
                              previewImageUrl={item.designPreviewUrl}
                              designSession={item.designData ? JSON.parse(item.designData) : undefined}
                              designName={item.designName}
                              size="small"
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.designName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.productName} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.orderItems.length > 3 && (
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">
                          +{order.orderItems.length - 3} sản phẩm khác
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Progress */}
                  <div className="mb-4">
                    <OrderProgressIndicator currentStatus={order.status} size="sm" />
                  </div>

                  {/* Order Summary */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <span>{order.orderItems.length} sản phẩm</span>
                      {order.completedAt && (
                        <span className="ml-4">
                          Hoàn thành: {new Date(order.completedAt).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-amber-600">
                        {order.totalAmount.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4">
            <Link
              href="/design"
              className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              Thiết kế mới
            </Link>
            
            <Link
              href="/cart"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
