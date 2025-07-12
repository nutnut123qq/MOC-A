'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDesigns } from '@/hooks/useDesigns';
import AuthGuard from '@/components/auth/AuthGuard';
import DesignCard from '@/components/design/DesignCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MyDesignsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    designs, 
    loading, 
    error, 
    deleteDesign, 
    cloneDesign, 
    loadDesigns 
  } = useDesigns();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Filter and sort designs
  const filteredDesigns = designs
    .filter(design => 
      design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (design.description && design.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleEditDesign = (designId: number) => {
    // Navigate to design editor with the design loaded
    router.push(`/design/tshirt/1?loadDesign=${designId}`);
  };

  const handleDeleteDesign = async (designId: number, designName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thiết kế "${designName}"?`)) {
      const success = await deleteDesign(designId);
      if (success) {
        alert('Thiết kế đã được xóa thành công!');
      }
    }
  };

  const handleCloneDesign = async (designId: number, originalName: string) => {
    const newName = prompt('Nhập tên cho thiết kế sao chép:', `${originalName} (Copy)`);
    if (newName && newName.trim()) {
      const clonedDesign = await cloneDesign(designId, newName.trim());
      if (clonedDesign) {
        alert('Thiết kế đã được sao chép thành công!');
      }
    }
  };

  const handleCreateNew = () => {
    router.push('/design');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen pt-20" style={{backgroundColor: '#fcf8ef'}}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Thiết Kế Của Tôi
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý và chỉnh sửa các thiết kế đã lưu
                  </p>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="text-white px-4 py-2 rounded-md transition-colors font-medium"
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
                  + Tạo Thiết Kế Mới
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm thiết kế..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#E21C34'} as any}
                onFocus={(e) => e.currentTarget.style.borderColor = '#E21C34'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#E21C34'} as any}
                onFocus={(e) => e.currentTarget.style.borderColor = '#E21C34'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Lỗi tải thiết kế
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={loadDesigns}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: 'rgba(226, 28, 52, 0.1)',
                        color: '#E21C34'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(226, 28, 52, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(226, 28, 52, 0.1)';
                      }}
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredDesigns.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'Không tìm thấy thiết kế' : 'Chưa có thiết kế nào'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Thử tìm kiếm với từ khóa khác'
                  : 'Bắt đầu tạo thiết kế đầu tiên của bạn'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateNew}
                    className="text-white px-4 py-2 rounded-md transition-colors font-medium"
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
                    Tạo Thiết Kế Mới
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Designs Grid */}
          {!loading && !error && filteredDesigns.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  onEdit={() => handleEditDesign(design.id)}
                  onDelete={() => handleDeleteDesign(design.id, design.name)}
                  onClone={() => handleCloneDesign(design.id, design.name)}
                />
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && filteredDesigns.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-500">
              Hiển thị {filteredDesigns.length} trong tổng số {designs.length} thiết kế
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
