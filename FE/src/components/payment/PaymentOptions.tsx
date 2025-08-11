'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import {
  WalletIcon,
  BanknotesIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface PaymentOptionsProps {
  orderTotal: number;
  onPaymentMethodSelect: (method: 'wallet' | 'payos' | 'payos-direct', data?: any) => void;
  disabled?: boolean;
}

export default function PaymentOptions({ 
  orderTotal, 
  onPaymentMethodSelect, 
  disabled = false 
}: PaymentOptionsProps) {
  const { balance, checkSufficientBalance, loading } = useWallet();
  const [canPayWithWallet, setCanPayWithWallet] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(true);

  useEffect(() => {
    const checkBalance = async () => {
      setCheckingBalance(true);
      try {
        const sufficient = await checkSufficientBalance(orderTotal);
        setCanPayWithWallet(sufficient);
      } catch (error) {
        console.error('Error checking balance:', error);
        setCanPayWithWallet(false);
      } finally {
        setCheckingBalance(false);
      }
    };

    if (orderTotal > 0) {
      checkBalance();
    }
  }, [orderTotal, balance]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Chọn phương thức thanh toán</h3>
      
      {/* Wallet Payment */}
      <div className={`border rounded-lg p-4 transition-all ${
        canPayWithWallet && !disabled
          ? 'border-green-500 bg-green-50 hover:bg-green-100' 
          : 'border-gray-300 bg-gray-50 opacity-60'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <WalletIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Thanh toán từ ví</h4>
              <p className="text-sm text-gray-600">
                Số dư hiện tại: {balance.toLocaleString()} VND
              </p>
              {!canPayWithWallet && balance < orderTotal && (
                <p className="text-sm text-red-600">
                  Thiếu {(orderTotal - balance).toLocaleString()} VND
                </p>
              )}
            </div>
          </div>
          
          <button
            disabled={!canPayWithWallet || disabled || loading || checkingBalance}
            onClick={() => onPaymentMethodSelect('wallet')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              canPayWithWallet && !disabled && !loading && !checkingBalance
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {checkingBalance ? 'Kiểm tra...' :
             canPayWithWallet ? 'Thanh toán' : 'Không đủ số dư'}
          </button>
        </div>
      </div>

      {/* Direct PayOS Payment */}
      <div className={`border rounded-lg p-4 transition-all ${
        disabled
          ? 'border-gray-300 bg-gray-50 opacity-60'
          : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Thanh toán trực tiếp</h4>
              <p className="text-sm text-gray-600">
                Quét mã QR để thanh toán ngay
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
                  </svg>
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs text-gray-500">Tức thời</span>
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={disabled || loading}
            onClick={() => onPaymentMethodSelect('payos-direct')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              disabled || loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán'}
          </button>
        </div>
      </div>

      {/* Cash on Delivery Payment */}
      <div className={`border rounded-lg p-4 transition-all ${
        disabled
          ? 'border-gray-300 bg-gray-50 opacity-60'
          : 'border-orange-500 bg-orange-50 hover:bg-orange-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <BanknotesIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Thanh toán sau khi nhận hàng</h4>
              <p className="text-sm text-gray-600">
                Thanh toán bằng tiền mặt khi nhận hàng
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-xs text-gray-500">Tiền mặt</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                  <span className="text-xs text-gray-500">Khi nhận hàng</span>
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={disabled || loading}
            onClick={() => onPaymentMethodSelect('payos')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              disabled || loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Tổng thanh toán:</span>
          <span className="text-xl font-bold text-gray-900">
            {orderTotal.toLocaleString()} VND
          </span>
        </div>
      </div>

      {/* Payment Notes */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>• Thanh toán từ ví: Tức thời, không phí giao dịch</p>
        <p>• Thanh toán trực tiếp: Quét mã QR, thanh toán tức thời qua ngân hàng</p>
        <p>• Thanh toán sau khi nhận hàng: Thanh toán bằng tiền mặt khi shipper giao hàng</p>
        <p>• Đơn hàng sẽ được xử lý sau khi xác nhận đặt hàng thành công</p>
      </div>
    </div>
  );
}
