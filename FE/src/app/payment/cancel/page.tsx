'use client';

import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thanh toán đã bị hủy</h2>
          <p className="text-gray-600 mb-8">
            Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn vẫn được lưu trong giỏ hàng.
          </p>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Đơn hàng chưa được thanh toán</h3>
              <p className="text-sm text-yellow-700">
                Bạn có thể quay lại giỏ hàng để tiếp tục thanh toán hoặc chỉnh sửa đơn hàng.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cart"
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Quay lại giỏ hàng
              </Link>
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
