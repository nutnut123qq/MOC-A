'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import OrdersTable from '@/components/admin/OrdersTable';
import OrderFilters from '@/components/admin/OrderFilters';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import { apiClient } from '@/lib/api';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters from URL params
    const status = searchParams.get('status');
    if (status && status !== 'all') {
      const statusValue = status === 'pending' ? OrderStatus.Pending :
                         status === 'processing' ? OrderStatus.Confirmed :
                         status === 'shipping' ? OrderStatus.Shipping :
                         status === 'completed' ? OrderStatus.Completed : 'all';
      setStatusFilter(statusValue);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, paymentStatusFilter, searchQuery, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const allOrders = await apiClient.getAllOrders();

      // Hiển thị tất cả orders (bao gồm cả chưa thanh toán) để admin có thể quản lý
      setOrders(allOrders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);

      // Handle specific error cases
      if (err.message.includes('403')) {
        setError('Bạn không có quyền truy cập chức năng quản lý đơn hàng. Vui lòng kiểm tra quyền admin.');
      } else if (err.message.includes('401')) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(err.message || 'Không thể tải danh sách đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment status filter
    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }

      // Show success message (you can replace with toast)
      alert('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error: any) {
      console.error('Error updating order status:', error);
      alert('Không thể cập nhật trạng thái đơn hàng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === OrderStatus.Pending).length,
      confirmed: orders.filter(o => o.status === OrderStatus.Confirmed).length,
      printing: orders.filter(o => o.status === OrderStatus.Printing).length,
      shipping: orders.filter(o => o.status === OrderStatus.Shipping).length,
      completed: orders.filter(o => o.status === OrderStatus.Completed).length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <AdminLayout 
        title="Quản Lý Đơn Hàng"
        breadcrumbs={[{ label: 'Quản lý đơn hàng' }]}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Quản Lý Đơn Hàng"
      breadcrumbs={[{ label: 'Quản lý đơn hàng' }]}
    >
      <div className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchOrders}
                className="ml-auto text-red-600 hover:text-red-800 font-medium"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <OrderFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          statusCounts={statusCounts}
          onRefresh={fetchOrders}
        />

        {/* Orders Table */}
        <OrdersTable
          orders={currentOrders}
          onStatusUpdate={handleStatusUpdate}
          onViewDetails={handleViewDetails}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </AdminLayout>
  );
}
