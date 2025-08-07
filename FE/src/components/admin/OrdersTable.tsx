'use client';

import { Order, OrderStatus } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';
import StatusUpdateDropdown from './StatusUpdateDropdown';
import CartDesignPreview from '@/components/cart/CartDesignPreview';

interface OrdersTableProps {
  orders: Order[];
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
  loading?: boolean;
}

export default function OrdersTable({
  orders,
  onStatusUpdate,
  onViewDetails,
  loading = false
}: OrdersTableProps) {
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

  const downloadUserImages = async (orderItem: any, orderNumber: string) => {
    try {
      if (!orderItem.designData) {
        alert('Không có dữ liệu thiết kế để tải');
        return;
      }

      // Parse design data để lấy ảnh user upload
      let designSession;
      try {
        designSession = JSON.parse(orderItem.designData);
        console.log('🔍 Design session:', designSession);
      } catch (e) {
        console.error('Error parsing design data:', e);
        alert('Không thể đọc dữ liệu thiết kế');
        return;
      }

      // Tìm tất cả layers có type 'image' (ảnh user upload)
      const imageUrls: string[] = [];
      if (designSession && designSession.designLayers) {
        designSession.designLayers.forEach((layer: any, index: number) => {

          if (layer.type === 'image' && layer.content && layer.visible) {
            // Handle different content formats
            let imageUrl = '';

            if (typeof layer.content === 'string') {
              // Legacy format: direct URL or base64
              if (layer.content.startsWith('http')) {
                imageUrl = layer.content;
              } else if (layer.content.startsWith('/uploads/')) {
                // Remove /uploads/ prefix for API endpoint
                const pathWithoutUploads = layer.content.replace('/uploads/', '');
                imageUrl = `http://localhost:5168/api/files/download?path=${encodeURIComponent(pathWithoutUploads)}`;
              } else if (layer.content.startsWith('data:image/')) {
                imageUrl = layer.content; // Base64 data
              }
            } else if (typeof layer.content === 'object') {
              // New format: object with file info
              if (layer.content.type === 'file' && layer.content.filePath) {
                // Remove /uploads/ prefix for API endpoint
                const pathWithoutUploads = layer.content.filePath.replace('/uploads/', '');
                imageUrl = `http://localhost:5168/api/files/download?path=${encodeURIComponent(pathWithoutUploads)}`;
              } else if (layer.content.type === 'temp' && layer.content.tempPath) {
                const pathWithoutUploads = layer.content.tempPath.replace('/uploads/', '');
                imageUrl = `http://localhost:5168/api/files/download?path=${encodeURIComponent(pathWithoutUploads)}`;
              } else if (layer.content.filePath) {
                // Legacy object format
                const pathWithoutUploads = layer.content.filePath.replace('/uploads/', '');
                imageUrl = `http://localhost:5168/api/files/download?path=${encodeURIComponent(pathWithoutUploads)}`;
              }
            }

            if (imageUrl) {
              imageUrls.push(imageUrl);
            }
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
          // Kiểm tra URL có hợp lệ không
          if (!imageUrl || (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:image/'))) {
            continue;
          }

          // Lấy extension từ URL
          const urlParts = imageUrl.split('.');
          const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';

          // Tạo tên file với extension đúng
          const filename = `${orderNumber}_${orderItem.designName || 'design'}_image_${i + 1}.${extension}`;

          // Download ảnh bằng fetch và blob để force download
          const response = await fetch(imageUrl, {
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Accept': 'image/*,*/*'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const blob = await response.blob();

          // Kiểm tra blob có hợp lệ không
          if (blob.size === 0) {
            throw new Error('Empty blob received');
          }

          // Tạo link download từ blob
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          // Không set target='_blank' để force download
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // Delay giữa các download
          if (i < imageUrls.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          // Fallback: Try simple window.open approach
          try {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (fallbackError) {
            alert(`Không thể tải ảnh ${i + 1}: ${error.message}. Bạn có thể click chuột phải vào ảnh và chọn "Save image as..."`);
          }
        }
      }

      alert(`Đã tải ${imageUrls.length} ảnh từ thiết kế "${orderItem.designName}"`);
    } catch (error) {
      console.error('Error downloading user images:', error);
      alert('Không thể tải ảnh. Vui lòng thử lại.');
    }
  };

  const downloadAllUserImages = async (order: Order) => {
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
            await downloadUserImages(item, order.orderNumber);
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đơn hàng</h3>
          <p className="mt-1 text-sm text-gray-500">
            Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {order.id}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerEmail}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerPhone}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {/* Hiển thị preview của sản phẩm đầu tiên */}
                    {order.orderItems.length > 0 && (
                      <div className="flex-shrink-0">
                        <div className="bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 p-1" style={{ width: '64px', height: '79px' }}>
                          <CartDesignPreview
                            previewImageUrl={order.orderItems[0].designPreviewUrl}
                            designSession={order.orderItems[0].designData ? JSON.parse(order.orderItems[0].designData) : undefined}
                            designName={order.orderItems[0].designName}
                            size="small"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderItems.length} sản phẩm
                        {order.orderItems.length > 1 && (
                          <span className="ml-1 text-xs text-gray-500">
                            (+{order.orderItems.length - 1} khác)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {order.orderItems[0]?.designName}
                        {order.orderItems.length > 1 && ', ...'}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Download User Images Button */}
                    <button
                      onClick={() => downloadAllUserImages(order)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Tải ảnh khách hàng upload"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onViewDetails(order)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Xem chi tiết"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <StatusUpdateDropdown
                      currentStatus={order.status}
                      onStatusUpdate={(newStatus) => onStatusUpdate(order.id, newStatus)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
