'use client';

import { useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';
import StatusUpdateDropdown from './StatusUpdateDropdown';
import CartDesignPreview from '@/components/cart/CartDesignPreview';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
}

export default function OrderDetailsModal({ 
  order, 
  onClose, 
  onStatusUpdate 
}: OrderDetailsModalProps) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadUserImages = async (orderItem: any) => {
    try {
      if (!orderItem.designData) {
        alert('Không có dữ liệu thiết kế để tải');
        return;
      }

      // Parse design data để lấy ảnh user upload
      let designSession;
      try {
        designSession = JSON.parse(orderItem.designData);
      } catch (e) {
        console.error('Error parsing design data:', e);
        alert('Không thể đọc dữ liệu thiết kế');
        return;
      }

      // Tìm tất cả layers có type 'image' (ảnh user upload)
      const imageUrls: string[] = [];
      if (designSession && designSession.designLayers) {
        designSession.designLayers.forEach((layer: any) => {
          if (layer.type === 'image' && layer.content && layer.visible) {
            imageUrls.push(layer.content);
          }
        });
      }

      if (imageUrls.length === 0) {
        alert('Không có ảnh nào được upload trong thiết kế này');
        return;
      }

      // Download từng ảnh
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        try {
          console.log('🔍 Downloading image:', imageUrl);

          // Kiểm tra URL có hợp lệ không
          if (!imageUrl || !imageUrl.startsWith('http')) {
            console.warn('Invalid image URL:', imageUrl);
            continue;
          }

          // Lấy extension từ URL
          const urlParts = imageUrl.split('.');
          const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';

          // Tạo tên file với extension đúng
          const filename = `${order.orderNumber}_${orderItem.designName || 'design'}_image_${i + 1}.${extension}`;

          // Thử download bằng cách tạo link trực tiếp trước
          try {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = filename;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            console.log('✅ Downloaded via direct link:', filename);
          } catch (directError) {
            console.log('Direct download failed, trying fetch method...');

            // Fallback: Fetch và tạo blob
            const response = await fetch(imageUrl, {
              mode: 'cors',
              credentials: 'omit'
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();

            // Kiểm tra blob có hợp lệ không
            if (blob.size === 0) {
              throw new Error('Empty blob received');
            }

            console.log('📦 Blob info:', {
              size: blob.size,
              type: blob.type
            });

            // Tạo link download từ blob
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('✅ Downloaded via fetch:', filename);
          }

          // Delay giữa các download
          if (i < imageUrls.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error('❌ Could not download image:', imageUrl, error);
          alert(`Không thể tải ảnh ${i + 1}: ${error.message}`);
        }
      }

      alert(`Đã tải ${imageUrls.length} ảnh từ thiết kế "${orderItem.designName}"`);
    } catch (error) {
      console.error('Error downloading user images:', error);
      alert('Không thể tải ảnh. Vui lòng thử lại.');
    }
  };

  const downloadAllUserImages = async () => {
    try {
      let totalImages = 0;

      for (const item of order.orderItems) {
        // Parse design data để đếm ảnh
        try {
          const designSession = JSON.parse(item.designData);
          const imageCount = designSession.designLayers?.filter((layer: any) =>
            layer.type === 'image' && layer.content && layer.visible
          ).length || 0;

          if (imageCount > 0) {
            await downloadUserImages(item);
            totalImages += imageCount;
            // Delay giữa các order item
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (e) {
          console.warn('Could not process design data for item:', item.id);
        }
      }

      if (totalImages === 0) {
        alert('Không có ảnh nào được upload trong đơn hàng này');
      } else {
        alert(`Đã tải tổng cộng ${totalImages} ảnh từ đơn hàng ${order.orderNumber}`);
      }
    } catch (error) {
      console.error('Error downloading all user images:', error);
      alert('Có lỗi xảy ra khi tải ảnh');
    }
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
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết đơn hàng {order.orderNumber}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                ID: {order.id} • Tạo lúc {formatDate(order.createdAt)}
              </p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-6">
                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Trạng thái đơn hàng</h3>
                  <div className="flex items-center justify-between">
                    <OrderStatusBadge status={order.status} size="lg" />
                    <StatusUpdateDropdown
                      currentStatus={order.status}
                      onStatusUpdate={(newStatus) => onStatusUpdate(order.id, newStatus)}
                    />
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin khách hàng</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tên:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Điện thoại:</span>
                      <span className="text-sm font-medium text-gray-900">{order.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin giao hàng</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
                    {order.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Ghi chú: </span>
                        <span className="text-sm text-gray-900">{order.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin thanh toán</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tổng tiền:</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <span className="text-sm font-medium text-green-600">Đã thanh toán</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Sản phẩm ({order.orderItems.length} items)
                </h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        {/* Design Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <CartDesignPreview
                              previewImageUrl={item.designPreviewUrl}
                              designSession={item.designData ? JSON.parse(item.designData) : undefined}
                              designName={item.designName}
                              size="small"
                              className="w-full h-full"
                            />
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {item.designName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {item.productName}
                              </p>
                            </div>

                            {/* Download Button */}
                            <button
                              onClick={() => downloadUserImages(item)}
                              className="ml-2 p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="Tải ảnh khách hàng upload"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Kích thước: {item.sizeWidth}×{item.sizeHeight}cm
                            </div>
                            <div className="text-sm text-gray-600">
                              SL: {item.quantity}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Đơn giá: {formatCurrency(item.unitPrice)}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.totalPrice)}
                            </div>
                          </div>
                          {item.specialInstructions && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Ghi chú: </span>
                              {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={downloadAllUserImages}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tải tất cả ảnh khách hàng
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                In đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
