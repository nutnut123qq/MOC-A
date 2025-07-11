'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatusHistory } from '@/types/order';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedOrders = await apiClient.getMyOrders();
      setOrders(fetchedOrders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId: number): Promise<Order | null> => {
    try {
      return await apiClient.getOrderById(orderId);
    } catch (err: any) {
      console.error('Error fetching order:', err);
      return null;
    }
  };

  const getOrderStatusHistory = async (orderId: number): Promise<OrderStatusHistory[]> => {
    try {
      return await apiClient.getOrderStatusHistory(orderId);
    } catch (err: any) {
      console.error('Error fetching order status history:', err);
      return [];
    }
  };

  const cancelOrder = async (orderId: number): Promise<boolean> => {
    try {
      await apiClient.cancelOrder(orderId);
      await fetchOrders(); // Refresh orders
      return true;
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      setError(err.message || 'Không thể hủy đơn hàng');
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto refresh orders every 30 seconds
    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchOrders();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrderById,
    getOrderStatusHistory,
    cancelOrder
  };
}
