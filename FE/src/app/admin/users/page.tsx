'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import UsersTable from '@/components/admin/UsersTable';
import UserFilters from '@/components/admin/UserFilters';
import UserDetailsModal from '@/components/admin/UserDetailsModal';
import { apiClient } from '@/lib/api';
import { User } from '@/types/auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, roleFilter, searchQuery, dateFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await apiClient.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user =>
        roleFilter === 'admin' ? user.role === 1 : user.role === 0
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(query))
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(user => {
        const userDate = new Date(user.createdAt);
        
        switch (dateFilter) {
          case 'today':
            return userDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return userDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return userDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleUserUpdate = async (userId: number, updateData: Partial<User>) => {
    try {
      await apiClient.updateUser(userId, updateData);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, ...updateData }
            : user
        )
      );

      // Update selected user if it's the one being updated
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, ...updateData } : null);
      }

      alert('Cập nhật người dùng thành công!');
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert('Không thể cập nhật người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await apiClient.deleteUser(userId);
      
      // Remove from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Close modals if deleted user was selected
      if (selectedUser && selectedUser.id === userId) {
        setShowDetailsModal(false);
        setShowEditModal(false);
        setSelectedUser(null);
      }

      alert('Xóa người dùng thành công!');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert('Không thể xóa người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getStatusCounts = () => {
    return {
      all: users.length,
      admin: users.filter(u => u.role === 1).length,
      user: users.filter(u => u.role === 0).length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <AdminLayout 
        title="Quản Lý Người Dùng"
        breadcrumbs={[{ label: 'Quản lý người dùng' }]}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Quản Lý Người Dùng"
      breadcrumbs={[{ label: 'Quản lý người dùng' }]}
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
                onClick={fetchUsers}
                className="ml-auto text-red-600 hover:text-red-800 font-medium"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <UserFilters
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          statusCounts={statusCounts}
          onRefresh={fetchUsers}
        />

        {/* Users Table */}
        <UsersTable
          users={currentUsers}
          onUserUpdate={handleUserUpdate}
          onViewDetails={handleViewDetails}
          onDeleteUser={handleDeleteUser}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
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

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={handleCloseModals}
        />
      )}
    </AdminLayout>
  );
}
