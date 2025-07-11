'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

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

interface PaymentResponse {
  checkoutUrl: string;
  orderCode: string;
  qrCode: string;
  accountNumber: string;
  accountName: string;
  bin: string;
  amount: number;
  description: string;
}

interface WalletContextType {
  balance: number;
  loading: boolean;
  topUp: (amount: number, description?: string) => Promise<PaymentResponse>;
  payFromWallet: (orderId: number, amount: number, description: string) => Promise<boolean>;
  getTransactionHistory: (page?: number, pageSize?: number) => Promise<WalletTransaction[]>;
  refreshBalance: () => Promise<void>;
  checkSufficientBalance: (amount: number) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const apiCall = async (url: string, options: RequestInit = {}) => {
    // Get fresh token from localStorage if not available in context
    const currentToken = token || localStorage.getItem('accessToken');

    if (!currentToken) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }

    return response.json();
  };

  const refreshBalance = async () => {
    if (!user) return;

    try {
      const data = await apiCall('/api/wallet/balance');
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const topUp = async (amount: number, description?: string): Promise<PaymentResponse> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      const data = await apiCall('/api/payment/create-topup-payment', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          description: description || `Nạp ${amount.toLocaleString()} VND vào ví`,
        }),
      });

      toast.success('Đã tạo link thanh toán thành công!');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo giao dịch nạp tiền');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const payFromWallet = async (orderId: number, amount: number, description: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      await apiCall('/api/wallet/pay', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          amount,
          description,
        }),
      });

      toast.success('Thanh toán từ ví thành công!');
      await refreshBalance();
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Thanh toán từ ví thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionHistory = async (page = 1, pageSize = 20): Promise<WalletTransaction[]> => {
    if (!user) {
      return [];
    }

    try {
      const data = await apiCall(`/api/wallet/transactions?page=${page}&pageSize=${pageSize}`);
      return data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  };

  const checkSufficientBalance = async (amount: number): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const data = await apiCall(`/api/wallet/check-balance/${amount}`);
      return data.hasSufficientBalance;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      refreshBalance();
    }
  }, [user]);

  const value: WalletContextType = {
    balance,
    loading,
    topUp,
    payFromWallet,
    getTransactionHistory,
    refreshBalance,
    checkSufficientBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
