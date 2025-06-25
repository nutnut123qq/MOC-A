'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  designData: {
    elements: any[];
    dimensions: { width: number; height: number };
  };
  productType: string;
  productSize: string;
  quantity: number;
  timestamp: string;
}

const productInfo: Record<string, { name: string; basePrice: number; emoji: string }> = {
  tshirt: { name: 'Áo Thun', basePrice: 150000, emoji: '👕' },
  hoodie: { name: 'Áo Hoodie', basePrice: 250000, emoji: '🧥' },
  cap: { name: 'Mũ Lưỡi Trai', basePrice: 120000, emoji: '🧢' },
  totebag: { name: 'Túi Tote', basePrice: 80000, emoji: '👜' }
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('designCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const calculateDecalPrice = (width: number, height: number) => {
    const area = (width / 20) * (height / 20); // Convert to cm²
    if (area <= 100) return 15000;
    if (area <= 200) return 25000;
    if (area <= 300) return 35000;
    if (area <= 400) return 45000;
    return 55000;
  };

  const calculateItemTotal = (item: CartItem) => {
    const product = productInfo[item.productType];
    const decalPrice = calculateDecalPrice(item.designData.dimensions.width, item.designData.dimensions.height);
    return (product.basePrice + decalPrice) * item.quantity;
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('designCart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('designCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('designCart');
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const renderDesignPreview = (item: CartItem) => {
    return (
      <div 
        className="relative bg-white border border-gray-200 rounded-lg"
        style={{ 
          width: 80,
          height: 60
        }}
      >
        {item.designData.elements.map((element, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: (element.position.x * 80) / item.designData.dimensions.width,
              top: (element.position.y * 60) / item.designData.dimensions.height,
              fontSize: Math.max(8, (element.style?.fontSize || 24) * 0.3),
              fontFamily: element.style?.fontFamily,
              color: element.style?.color,
              transform: 'scale(0.3)',
              transformOrigin: 'top left'
            }}
          >
            {element.type === 'image' ? (
              <img 
                src={element.content} 
                alt="Design element" 
                style={{ 
                  width: (element.style?.width || 100) * 0.3,
                  height: (element.style?.height || 100) * 0.3
                }}
                className="object-cover rounded"
              />
            ) : (
              element.content
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
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
              onClick={clearCart}
              className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
            >
              🗑️ Xóa tất cả
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Hãy thiết kế và thêm sản phẩm vào giỏ hàng</p>
            <Link
              href="/design"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
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
                const decalPrice = calculateDecalPrice(item.designData.dimensions.width, item.designData.dimensions.height);
                const itemTotal = calculateItemTotal(item);

                return (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Preview */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="text-4xl">{product.emoji}</div>
                          <div className="absolute -bottom-2 -right-2">
                            {renderDesignPreview(item)}
                          </div>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600 text-sm">Kích thước: {item.productSize}</p>
                        <p className="text-gray-600 text-sm">
                          Decal: {(item.designData.dimensions.width / 20).toFixed(1)} × {(item.designData.dimensions.height / 20).toFixed(1)} cm
                        </p>
                        
                        {/* Price Breakdown */}
                        <div className="mt-3 text-sm text-gray-600">
                          <div>Sản phẩm: {product.basePrice.toLocaleString('vi-VN')}₫</div>
                          <div>Decal: {decalPrice.toLocaleString('vi-VN')}₫</div>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex flex-col items-end space-y-3">
                        <div className="text-lg font-bold text-gray-900">
                          {itemTotal.toLocaleString('vi-VN')}₫
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                    <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">{totalAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                  Tiến hành thanh toán
                </button>

                <Link
                  href="/design"
                  className="block w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-center"
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
