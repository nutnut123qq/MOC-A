'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  CreditCardIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface WalletTransaction {
  id: number;
  walletId: number;
  orderId?: number;
  transactionType: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  payOSOrderCode?: string;
  payOSTransactionId?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  completedAt?: string;
  failureReason?: string;
  createdAt: string;
}

export default function WalletPage() {
  const { balance, loading, topUp, getTransactionHistory, refreshBalance } = useWallet();
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [topUpAmount, setTopUpAmount] = useState(100000);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const data = await getTransactionHistory(1, 20);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleTopUp = async () => {
    try {
      const paymentData = await topUp(topUpAmount);
      // Redirect to PayOS checkout
      window.open(paymentData.checkoutUrl, '_blank');
      setShowTopUpModal(false);
    } catch (error) {
      console.error('Error creating top-up payment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'Pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'Failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'Cancelled':
        return <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'Failed':
        return 'text-red-600 bg-red-50';
      case 'Cancelled':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ví của tôi</h2>
            <p className="text-4xl font-bold">{balance.toLocaleString()} VND</p>
            <p className="text-amber-100 mt-2">Số dư khả dụng</p>
          </div>
          <div className="text-right">
            <CreditCardIcon className="w-16 h-16 text-white opacity-80" />
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setShowTopUpModal(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowUpIcon className="w-5 h-5" />
            Nạp tiền
          </button>
          <button
            onClick={refreshBalance}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Lịch sử giao dịch</h3>
          <button
            onClick={loadTransactions}
            className="text-amber-600 hover:text-amber-700 text-sm"
          >
            Làm mới
          </button>
        </div>

        {loadingTransactions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Đang tải...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCardIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {transaction.transactionType === 'TOPUP' ? (
                        <ArrowUpIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="w-5 h-5 text-red-500" />
                      )}
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                      </p>
                      {transaction.payOSOrderCode && (
                        <p className="text-xs text-gray-400">Mã GD: {transaction.payOSOrderCode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} VND
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'Completed' ? 'Hoàn thành' :
                       transaction.status === 'Pending' ? 'Đang xử lý' :
                       transaction.status === 'Failed' ? 'Thất bại' : 'Đã hủy'}
                    </span>
                  </div>
                </div>
                
                {transaction.failureReason && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                    Lý do thất bại: {transaction.failureReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Nạp tiền vào ví</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn số tiền
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        topUpAmount === amount
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {amount.toLocaleString()} VND
                    </button>
                  ))}
                </div>
                
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nhập số tiền khác"
                  min="10000"
                  max="10000000"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleTopUp}
                  disabled={loading || topUpAmount < 10000}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Nạp tiền'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
