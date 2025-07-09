'use client';

import { useState } from 'react';
import { Design } from '@/lib/design-api';

interface DesignCardProps {
  design: Design;
  onEdit: () => void;
  onDelete: () => void;
  onClone: () => void;
}

export default function DesignCard({ design, onEdit, onDelete, onClone }: DesignCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLayerCount = () => {
    return design.designSession?.designLayers?.length || 0;
  };

  const getDesignInfo = () => {
    if (!design.designSession) return null;
    
    return {
      size: design.designSession.selectedSize,
      color: design.designSession.selectedColor,
      layers: getLayerCount()
    };
  };

  const designInfo = getDesignInfo();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Preview Image */}
      <div className="aspect-square bg-gray-100 relative group">
        {design.previewImageUrl ? (
          <img
            src={design.previewImageUrl}
            alt={design.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Chưa có ảnh xem trước</p>
            </div>
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
            <button
              onClick={onEdit}
              className="bg-white text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-white text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-2 right-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => {
                onClone();
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sao chép
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Xóa
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 truncate" title={design.name}>
          {design.name}
        </h3>

        {/* Description */}
        {design.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2" title={design.description}>
            {design.description}
          </p>
        )}

        {/* Product Info */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {design.productName}
        </div>

        {/* Design Info */}
        {designInfo && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>Size: {designInfo.size}</span>
            <span>Màu: {designInfo.color}</span>
            <span>{designInfo.layers} lớp</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatDate(design.createdAt)}</span>
          {design.updatedAt !== design.createdAt && (
            <span title={`Cập nhật: ${formatDate(design.updatedAt)}`}>
              Đã sửa
            </span>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
