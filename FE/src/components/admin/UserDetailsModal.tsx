'use client';

import { useEffect } from 'react';
import { User } from '@/types/auth';

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  onClose
}: UserDetailsModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {user.firstName?.charAt(0) || user.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-500">
                  ID: {user.id} • {user.role === 1 ? 'Quản trị viên' : 'Người dùng'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Thông tin cơ bản
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                    <p className="text-sm text-gray-900 mt-1">{user.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{user.email}</p>
                  </div>
                  
                  {user.phoneNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                      <p className="text-sm text-gray-900 mt-1">{user.phoneNumber}</p>
                    </div>
                  )}
                  
                  {user.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )}
                  
                  {user.gender && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Giới tính</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Thông tin tài khoản
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Vai trò</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 1 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 1 ? '👑 Quản trị viên' : '👤 Người dùng'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày đăng ký</label>
                    <p className="text-sm text-gray-900 mt-1">{formatDate(user.createdAt)}</p>
                  </div>
                  

                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tóm tắt hoạt động
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-blue-600">Đơn hàng</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-green-600">Thiết kế</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">0₫</div>
                  <div className="text-sm text-purple-600">Tổng chi tiêu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
