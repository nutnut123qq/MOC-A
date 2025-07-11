'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { 
  CreditCardIcon, 
  WalletIcon,
  QrCodeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface PaymentOptionsProps {
  orderTotal: number;
  onPaymentMethodSelect: (method: 'wallet' | 'payos', data?: any) => void;
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
      
      {/* PayOS Payment */}
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
              <h4 className="font-medium text-gray-900">Thanh toán qua PayOS</h4>
              <p className="text-sm text-gray-600">
                Chuyển khoản ngân hàng, QR Code
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <QrCodeIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
                <div className="flex items-center gap-1">
                  <BanknotesIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500">Chuyển khoản</span>
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
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán'}
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
        <p>• Thanh toán qua PayOS: Hỗ trợ tất cả ngân hàng, có phí theo quy định</p>
        <p>• Đơn hàng sẽ được xử lý sau khi thanh toán thành công</p>
      </div>
    </div>
  );
}
