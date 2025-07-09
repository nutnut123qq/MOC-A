'use client';

import { useState } from 'react';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { CreateDesignRequest } from '@/lib/design-api';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (designData: CreateDesignRequest) => Promise<void>;
  designSession: TShirtDesignSession;
  productId: number;
  productName: string;
  loading?: boolean;
}

export default function SaveDesignModal({
  isOpen,
  onClose,
  onSave,
  designSession,
  productId,
  productName,
  loading = false
}: SaveDesignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thiết kế');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const designData: CreateDesignRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        productId,
        designSession
      };

      await onSave(designData);
      
      // Reset form and close modal
      setFormData({ name: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Error saving design:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', description: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Lưu Thiết Kế
              </h3>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-4">
              {/* Product Info */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">Sản phẩm:</p>
                <p className="font-medium text-gray-900">{productName}</p>
              </div>

              {/* Design Name */}
              <div>
                <label htmlFor="designName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thiết kế *
                </label>
                <input
                  type="text"
                  id="designName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên cho thiết kế của bạn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                  maxLength={100}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="designDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="designDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn về thiết kế..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                  maxLength={500}
                />
              </div>

              {/* Design Info */}
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-600 mb-1">Thông tin thiết kế:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Kích thước: {designSession.selectedSize}</p>
                  <p>• Màu sắc: {designSession.selectedColor}</p>
                  <p>• Số lớp thiết kế: {designSession.designLayers.length}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thiết kế'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
