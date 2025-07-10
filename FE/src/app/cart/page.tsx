'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProductType } from '@/types/product';

const productInfo: Record<ProductType, { name: string; emoji: string }> = {
  [ProductType.Shirt]: { name: 'Áo Thun', emoji: '👕' },
  [ProductType.Hat]: { name: 'Mũ Lưỡi Trai', emoji: '🧢' },
  [ProductType.CanvasBag]: { name: 'Túi Canvas', emoji: '👜' }
};

export default function CartPage() {
  const { cartItems, cartTotal, loading, error, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [updating, setUpdating] = useState<number | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Giỏ Hàng</h1>
            <p className="text-gray-600 mt-1">
              {cartItems.length} sản phẩm trong giỏ hàng
            </p>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
            >
              🗑️ Xóa tất cả
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart */
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = productInfo[item.productType];
                const isUpdatingThis = updating === item.id;
                
                return (
                  <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      {/* Design Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.designPreviewUrl ? (
                            <img 
                              src={item.designPreviewUrl} 
                              alt={item.designName}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-2xl">{product.emoji}</span>
                          )}
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {item.designName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {product.name} • {item.sizeWidth}×{item.sizeHeight}cm
                            </p>
                            <p className="text-lg font-bold text-amber-600 mt-1">
                              {item.unitPrice.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdatingThis}
                            className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                          >
                            🗑️
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 mt-4">
                          <span className="text-sm text-gray-600">Số lượng:</span>
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
                          <span className="text-sm text-gray-600">
                            = {item.totalPrice.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{cartTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-amber-600">{cartTotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-colors text-center block"
                >
                  Tiến hành thanh toán
                </Link>
                
                <Link
                  href="/design"
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center block"
                >
                  Tiếp tục thiết kế
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
