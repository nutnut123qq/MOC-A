'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { apiClient } from '@/lib/api';
import { CreateOrderDto } from '@/types/order';
import PaymentOptions from '@/components/payment/PaymentOptions';
import toast from 'react-hot-toast';

// Helper function to format checkout item description
const formatCheckoutItemDescription = (item: CartItem): string => {
  try {
    // Determine product type based on size
    const maxSize = Math.max(item.sizeWidth, item.sizeHeight);
    const isCombo = maxSize >= 150;
    const productTypeText = isCombo ? 'Combo Áo + Decal' : 'Decal riêng';

    // Parse design session to get color and size
    let colorText = '';
    let sizeText = '';

    if (item.designData) {
      const designSession = JSON.parse(item.designData);

      // Format color
      const colorMap: Record<string, string> = {
        'white': 'Trắng',
        'black': 'Đen',
        'red': 'Đỏ',
        'blue': 'Xanh dương',
        'green': 'Xanh lá',
        'yellow': 'Vàng',
        'purple': 'Tím',
        'pink': 'Hồng',
        'orange': 'Cam',
        'gray': 'Xám'
      };
      colorText = colorMap[designSession.selectedColor] || designSession.selectedColor;

      // Format size
      const sizeMap: Record<string, string> = {
        's': 'S',
        'm': 'M',
        'l': 'L',
        'xl': 'XL',
        'xxl': 'XXL'
      };
      sizeText = sizeMap[designSession.selectedSize] || designSession.selectedSize.toUpperCase();
    }

    // Build description parts
    const parts = [productTypeText];
    if (colorText) parts.push(colorText);
    if (sizeText) parts.push(sizeText);

    return parts.join(' • ');
  } catch (error) {
    console.error('Error formatting checkout item description:', error);
    // Fallback to old format
    return `${item.productName} • ${item.sizeWidth}×${item.sizeHeight}cm`;
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { payFromWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'info' | 'payment'>('info');

  // Use cart total from API (not fixed price)
  const getOrderTotal = () => {
    return cartTotal; // Use cartTotal from CartContext which comes from API
  };

  const [formData, setFormData] = useState({
    customerName: user?.firstName + ' ' + user?.lastName || '',
    customerPhone: user?.phoneNumber || '',
    customerEmail: user?.email || '',
    deliveryAddress: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để đặt hàng');
      return;
    }

    if (cartItems.length === 0) {
      setError('Giỏ hàng trống');
      return;
    }

    // Validate form
    if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setStep('payment');
  };

  const handlePaymentMethodSelect = async (method: 'wallet' | 'payos') => {
    try {
      setLoading(true);
      setError(null);

      // Create order first
      const orderData: CreateOrderDto = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        deliveryAddress: formData.deliveryAddress,
        notes: formData.notes,
        orderItems: [] // Empty for from-cart endpoint - backend will use cart items
      };

      const order = await apiClient.createOrderFromCart(orderData);

      if (method === 'wallet') {
        // Pay from wallet
        const success = await payFromWallet(
          order.id,
          getOrderTotal(),
          `Thanh toán đơn hàng #${order.orderNumber}`
        );

        if (success) {
          await clearCart();
          toast.success('Thanh toán thành công!');
          router.push(`/orders/${order.id}?success=true`);
        } else {
          setError('Thanh toán từ ví thất bại');
        }
      } else {
        // Pay via PayOS
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            orderId: order.id,
            amount: getOrderTotal(),
            description: `Thanh toán đơn hàng #${order.orderNumber}`,
            returnUrl: `${window.location.origin}/payment/return`,
            cancelUrl: `${window.location.origin}/payment/cancel`
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment');
        }

        const paymentResponse = await response.json();
        // Redirect to PayOS checkout
        window.location.href = paymentResponse.checkoutUrl;
      }

    } catch (err: any) {
      console.error('Error processing payment:', err);

      // More detailed error handling
      let errorMessage = 'Không thể xử lý thanh toán. Vui lòng thử lại.';

      if (err.message?.includes('400')) {
        errorMessage = 'Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại giỏ hàng.';
      } else if (err.message?.includes('401')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.message?.includes('Cart is empty')) {
        errorMessage = 'Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
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
            <p className="text-gray-600 mb-8">Bạn cần đăng nhập để đặt hàng</p>
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Không có sản phẩm nào để thanh toán</p>
            <Link
              href="/design"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              Bắt đầu thiết kế
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-1">
            {step === 'info' ? 'Hoàn tất thông tin để đặt hàng' : 'Chọn phương thức thanh toán'}
          </p>

          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            <div className={`flex items-center ${step === 'info' ? 'text-amber-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'info' ? 'bg-amber-600 text-white' : 'bg-green-600 text-white'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Thông tin đặt hàng</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'payment' ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            {step === 'info' ? (
              <form onSubmit={handleInfoSubmit} className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ giao hàng *
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Nhập địa chỉ chi tiết để giao hàng..."
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Ghi chú thêm cho đơn hàng..."
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <Link
                  href="/cart"
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  ← Quay lại giỏ hàng
                </Link>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </span>
                  ) : (
                    'Tiếp tục thanh toán →'
                  )}
                </button>
              </div>
            </form>
            ) : (
              /* Payment Step */
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <PaymentOptions
                    orderTotal={getOrderTotal()}
                    onPaymentMethodSelect={handlePaymentMethodSelect}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep('info')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    ← Quay lại thông tin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng của bạn</h3>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium truncate">{item.designName}</p>
                      <p className="text-gray-600">
                        {formatCheckoutItemDescription(item)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium ml-2">
                      {item.totalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{getOrderTotal().toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span style={{color: '#E21C34'}}>{getOrderTotal().toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
