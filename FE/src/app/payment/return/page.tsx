'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderCode, setOrderCode] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const code = searchParams.get('code');
      const orderCodeParam = searchParams.get('orderCode');
      const orderIdParam = searchParams.get('orderId');

      setOrderCode(orderCodeParam || '');
      setOrderId(orderIdParam || '');

      if (code === '00') {
        // Payment successful
        setStatus('success');

        try {
          // Clear cart after successful payment
          console.log('🔄 Clearing cart after successful payment...');
          await clearCart();
          console.log('✅ Cart cleared successfully');
          toast.success('Thanh toán thành công! Giỏ hàng đã được xóa.');

          // Force refresh cart page by adding timestamp to URL
          setTimeout(() => {
            console.log('🔄 Redirecting to cart page...');
            window.location.href = '/cart?refresh=' + Date.now();
          }, 2000);

        } catch (error) {
          console.error('❌ Error clearing cart after payment:', error);
          // Don't show error to user as payment was successful
        }
      } else {
        // Payment failed
        setStatus('failed');
        toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      }
    };

    handlePaymentReturn();
  }, [searchParams, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-2">Cảm ơn bạn đã đặt hàng tại DecalStudio</p>
            <div className="text-sm text-gray-500 mb-8 space-y-1">
              {orderCode && <p>Mã giao dịch: <span className="font-mono">{orderCode}</span></p>}
              {orderId && <p>Mã đơn hàng: <span className="font-mono">#{orderId}</span></p>}
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Đơn hàng đã được xác nhận</h3>
                <p className="text-sm text-green-700">
                  Chúng tôi sẽ bắt đầu xử lý đơn hàng của bạn và gửi thông báo cập nhật qua email.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {orderId ? (
                  <Link
                    href={`/orders/${orderId}`}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Xem chi tiết đơn hàng
                  </Link>
                ) : (
                  <Link
                    href="/orders"
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Xem đơn hàng
                  </Link>
                )}
                <Link
                  href="/design"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Tiếp tục thiết kế
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thanh toán thất bại</h2>
          <p className="text-gray-600 mb-8">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">Đơn hàng chưa được thanh toán</h3>
              <p className="text-sm text-red-700">
                Bạn có thể thử thanh toán lại hoặc liên hệ với chúng tôi để được hỗ trợ.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cart"
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Thử lại thanh toán
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    }>
      <PaymentReturnContent />
    </Suspense>
  );
}
