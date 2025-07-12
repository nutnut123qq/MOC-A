'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { apiClient } from '@/lib/api';
import { User } from '@/types/auth';
import { Order } from '@/types/order';
import { DesignListItem } from '@/types/design';
// import { useOptimizedData } from '@/hooks/useOptimizedData';
// import { PageWrapper } from '@/components/layout/OptimizedLayout';
// import FastLoading from '@/components/ui/FastLoading';
import { showToast } from '@/components/ui/ToastProvider';

interface ProfileStats {
  totalOrders: number;
  totalDesigns: number;
  totalSpent: number;
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [stats, setStats] = useState<ProfileStats>({ totalOrders: 0, totalDesigns: 0, totalSpent: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [designs, setDesigns] = useState<DesignListItem[]>([]);

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      });
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user's orders and designs with individual error handling
      let ordersData: Order[] = [];
      let designsData: DesignListItem[] = [];

      // Try to load orders
      try {
        ordersData = await apiClient.getMyOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
        // Continue without orders data
      }

      // Try to load designs
      try {
        designsData = await apiClient.getMyDesigns();
        setDesigns(designsData);
      } catch (error) {
        console.error('Error loading designs:', error);
        // Continue without designs data
      }

      // Calculate stats
      const totalSpent = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
      setStats({
        totalOrders: ordersData.length,
        totalDesigns: designsData.length,
        totalSpent,
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      showToast('Không thể tải dữ liệu profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      // Call API to update user profile
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        showToast('Cập nhật thông tin thành công!', 'success');
        setIsEditing(false);
        // Refresh user data
        window.location.reload();
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Có lỗi xảy ra khi cập nhật thông tin', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Có lỗi xảy ra khi cập nhật thông tin', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user?.firstName,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
      dateOfBirth: user?.dateOfBirth,
      gender: user?.gender,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#fcf8ef'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#E21C34'}}></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen py-8" style={{backgroundColor: '#fcf8ef'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
            <p className="mt-2 text-gray-600">Quản lý thông tin tài khoản và xem hoạt động của bạn</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
                      style={{
                        color: '#E21C34',
                        borderColor: '#E21C34'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(226, 28, 52, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                        style={{
                          backgroundColor: '#E21C34'
                        }}
                        onMouseEnter={(e) => {
                          if (!saving) e.currentTarget.style.backgroundColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          if (!saving) e.currentTarget.style.backgroundColor = '#E21C34';
                        }}
                      >
                        {saving ? 'Đang lưu...' : 'Lưu'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-md transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to right, #dc2626, #E21C34)`
                    }}
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user?.fullName}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">
                      Tham gia từ {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.firstName || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{'--tw-ring-color': '#E21C34'} as any}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#E21C34'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    ) : (
                      <p className="text-gray-900">{user?.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.lastName || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{'--tw-ring-color': '#E21C34'} as any}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#E21C34'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    ) : (
                      <p className="text-gray-900">{user?.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phoneNumber || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{'--tw-ring-color': '#E21C34'} as any}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#E21C34'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.phoneNumber || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedUser.dateOfBirth ? editedUser.dateOfBirth.split('T')[0] : ''}
                        onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{'--tw-ring-color': '#E21C34'} as any}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#E21C34'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      />
                    ) : (
                      <p className="text-gray-900">{formatDate(user?.dateOfBirth)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        value={editedUser.gender || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{'--tw-ring-color': '#E21C34'} as any}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#E21C34'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {user?.gender === 'male' ? 'Nam' : 
                         user?.gender === 'female' ? 'Nữ' : 
                         user?.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats and Activity */}
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng đơn hàng</span>
                    <span className="font-semibold text-gray-900">{stats.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Thiết kế đã tạo</span>
                    <span className="font-semibold text-gray-900">{stats.totalDesigns}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng chi tiêu</span>
                    <span className="font-semibold" style={{color: '#E21C34'}}>{formatCurrency(stats.totalSpent)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <span>Xem đơn hàng</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => router.push('/my-designs')}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <span>Thiết kế của tôi</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => router.push('/wallet')}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <span>Ví của tôi</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => router.push('/design')}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-white rounded-md transition-colors"
                    style={{
                      background: `linear-gradient(to right, #dc2626, #E21C34)`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(to right, #b91c1c, #dc2626)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `linear-gradient(to right, #dc2626, #E21C34)`;
                    }}
                  >
                    <span>Tạo thiết kế mới</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
