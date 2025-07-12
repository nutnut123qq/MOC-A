'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';
import RevenueChart from '@/components/analytics/RevenueChart';
import OrderStatusChart from '@/components/analytics/OrderStatusChart';
import PaymentMethodChart from '@/components/analytics/PaymentMethodChart';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import { apiClient } from '@/lib/api';
import { AnalyticsOverview, AnalyticsFilter } from '@/types/analytics';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AnalyticsFilter>({ period: '30days' });

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAnalyticsOverview(filter);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Không thể tải dữ liệu analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout
        title="Báo Cáo & Thống Kê"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics' }
        ]}
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout
        title="Báo Cáo & Thống Kê"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics' }
        ]}
      >
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout
        title="Báo Cáo & Thống Kê"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics' }
        ]}
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Không có dữ liệu để hiển thị</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Báo Cáo & Thống Kê"
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Analytics' }
      ]}
    >
      <div className="space-y-6">
        {/* Date Range Picker */}
        <DateRangePicker filter={filter} onFilterChange={setFilter} />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Tổng Doanh Thu"
            value={formatCurrency(analytics.revenue.totalRevenue)}
            subtitle={`Hôm nay: ${formatCurrency(analytics.revenue.todayRevenue)}`}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            color="green"
            trend={{
              value: analytics.revenue.growthPercentage,
              isPositive: analytics.revenue.growthPercentage >= 0
            }}
          />

          <AnalyticsCard
            title="Tổng Người Dùng"
            value={analytics.users.totalUsers}
            subtitle={`${analytics.users.activeUsers} đang hoạt động`}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            color="blue"
            trend={{
              value: analytics.users.growthPercentage,
              isPositive: analytics.users.growthPercentage >= 0
            }}
          />

          <AnalyticsCard
            title="Tổng Đơn Hàng"
            value={analytics.orders.totalOrders}
            subtitle={`${analytics.orders.pendingOrders} đang chờ xử lý`}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            color="purple"
          />

          <AnalyticsCard
            title="Tổng Thiết Kế"
            value={analytics.designs.totalDesigns}
            subtitle={`${analytics.designs.designsToday} hôm nay`}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            }
            color="indigo"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart 
            data={analytics.revenue.revenueByDate} 
            title="Doanh thu theo ngày"
          />
          <OrderStatusChart 
            data={analytics.orders.statusDistribution}
            title="Phân bố trạng thái đơn hàng"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentMethodChart 
            data={analytics.payments.paymentMethodDistribution}
            title="Phân bố phương thức thanh toán"
          />
          
          {/* Additional Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Thống kê chi tiết</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tỷ lệ hoàn thành đơn hàng:</span>
                <span className="font-semibold text-green-600">
                  {analytics.orders.completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Giá trị đơn hàng trung bình:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(analytics.orders.averageOrderValue)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Thiết kế trung bình/người dùng:</span>
                <span className="font-semibold text-gray-900">
                  {analytics.designs.averageDesignsPerUser.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tỷ lệ thành công PayOS:</span>
                <span className="font-semibold text-blue-600">
                  {analytics.payments.payOSSuccessRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tỷ lệ thành công Wallet:</span>
                <span className="font-semibold text-green-600">
                  {analytics.payments.walletSuccessRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Xuất báo cáo</h3>
              <p className="text-gray-600 mt-1">Tải xuống báo cáo analytics dưới dạng PDF hoặc Excel</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
