'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { ProductType } from '@/types/product';
import { PaymentStatus } from '@/types/order';

import OrderItemCard from '@/components/cart/OrderItemCard';
import CartDesignPreview from '@/components/cart/CartDesignPreview';

const productInfo: Record<ProductType, { name: string; emoji: string }> = {
  [ProductType.Shirt]: { name: 'Áo Thun', emoji: '👕' },
  [ProductType.Hat]: { name: 'Mũ Lưỡi Trai', emoji: '🧢' },
  [ProductType.CanvasBag]: { name: 'Túi Canvas', emoji: '👜' }
};

export default function CartPage() {
  const { cartItems, cartTotal, loading, error, updateCartItem, removeFromCart, clearCart, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const [updating, setUpdating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid');



  // Filter orders by payment status
  const paidOrders = orders.filter(order => order.paymentStatus === PaymentStatus.Paid);

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(cartItemId);
      await updateCartItem(cartItemId, {
        quantity: newQuantity,
        specialInstructions: cartItems.find(item => item.id === cartItemId)?.specialInstructions || ''
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setUpdating(cartItemId);
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([refreshCart(), fetchOrders()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Auto refresh when component mounts or when coming back from payment
  useEffect(() => {
    if (isAuthenticated) {
      handleRefresh();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem giỏ hàng</p>
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

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Giỏ Hàng & Đơn Hàng</h1>
            <button
              onClick={handleRefresh}
              disabled={loading || ordersLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <span className={loading || ordersLoading ? 'animate-spin' : ''}>🔄</span>
              <span>Làm mới</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('unpaid')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'unpaid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🛒 Chưa thanh toán ({cartItems.length})
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'paid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✅ Đã thanh toán ({paidOrders.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}



        {/* Tab Content */}
        {activeTab === 'unpaid' ? (
          cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-8">Hãy thiết kế và thêm sản phẩm vào giỏ hàng</p>
              <Link
                href="/design"
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
              >
                Bắt đầu thiết kế
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div>
              {/* Unpaid Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Sản phẩm chưa thanh toán
                </h2>
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors text-sm"
                >
                  🗑️ Xóa tất cả
                </button>
              </div>

              {/* Simple Cart Items List */}
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => {
                  const product = productInfo[item.productType];
                  const isUpdatingThis = updating === item.id;

                  return (
                    <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start space-x-4">
                        {/* Design Preview */}
                        <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <CartDesignPreview
                            previewImageUrl={item.designPreviewUrl}
                            designSession={item.designData ? JSON.parse(item.designData) : undefined}
                            designName={item.designName}
                            size="small"
                            className="w-full h-full"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.designName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {product.name} • {item.sizeWidth}×{item.sizeHeight}cm
                          </p>
                          {item.specialInstructions && (
                            <p className="text-sm text-gray-500 mt-1">
                              Ghi chú: {item.specialInstructions}
                            </p>
                          )}
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdatingThis || item.quantity <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">
                              {isUpdatingThis ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdatingThis}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {item.totalPrice.toLocaleString('vi-VN')}₫
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdatingThis}
                              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-md ml-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng đơn hàng</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{cartTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Tổng cộng</span>
                      <span className="font-bold text-xl text-amber-600">
                        {cartTotal.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-colors text-center block mb-3"
                >
                  Tiến hành thanh toán
                </Link>

                <Link
                  href="/design"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center block"
                >
                  Tiếp tục thiết kế
                </Link>
              </div>
            </div>
          )
        ) : (
          /* Paid Orders */
          paidOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-gray-600 mb-8">Các đơn hàng đã thanh toán sẽ hiển thị ở đây</p>
              <Link
                href="/design"
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
              >
                Bắt đầu thiết kế
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Đơn hàng đã thanh toán
                </h2>
                <p className="text-gray-600 mt-1">
                  Theo dõi trạng thái đơn hàng của bạn
                </p>
              </div>

              <div className="space-y-4">
                {paidOrders.map((order) => (
                  <OrderItemCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
