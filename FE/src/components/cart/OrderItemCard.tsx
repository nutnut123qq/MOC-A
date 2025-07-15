'use client';

import Link from 'next/link';
import { Order, OrderStatus } from '@/types/order';
import { ProductType } from '@/types/product';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import OrderStatusBadge from './OrderStatusBadge';
import CartDesignPreview from './CartDesignPreview';

interface OrderItemCardProps {
  order: Order;
}

const productInfo: Record<ProductType, { name: string; emoji: string }> = {
  [ProductType.Shirt]: { name: 'Áo Thun', emoji: '👕' },
  [ProductType.Hat]: { name: 'Mũ Lưỡi Trai', emoji: '🧢' },
  [ProductType.CanvasBag]: { name: 'Túi Canvas', emoji: '👜' }
};

// Helper function to format order item description
const formatOrderItemDescription = (item: any): string => {
  try {
    // Determine product type based on size
    const maxSize = Math.max(item.sizeWidth, item.sizeHeight);
    const isCombo = maxSize >= 150;
    const productTypeText = isCombo ? 'Combo Áo + Decal' : 'Decal riêng';

    // Parse design session to get color and size
    let colorText = '';
    let sizeText = '';

    if (item.designData) {
      const designSession = JSON.parse(item.designData);

      // Format color
      const colorMap: Record<string, string> = {
        'white': 'Trắng',
        'black': 'Đen',
        'red': 'Đỏ',
        'blue': 'Xanh dương',
        'green': 'Xanh lá',
        'yellow': 'Vàng',
        'purple': 'Tím',
        'pink': 'Hồng',
        'orange': 'Cam',
        'gray': 'Xám'
      };
      colorText = colorMap[designSession.selectedColor] || designSession.selectedColor;

      // Format size
      const sizeMap: Record<string, string> = {
        's': 'S',
        'm': 'M',
        'l': 'L',
        'xl': 'XL',
        'xxl': 'XXL'
      };
      sizeText = sizeMap[designSession.selectedSize] || designSession.selectedSize.toUpperCase();
    }

    // Build description parts
    const parts = [productTypeText];
    if (colorText) parts.push(colorText);
    if (sizeText) parts.push(sizeText);

    return parts.join(' • ');
  } catch (error) {
    console.error('Error formatting order item description:', error);
    // Fallback to old format
    const product = productInfo[item.productType];
    return `${product.name} • ${item.sizeWidth}×${item.sizeHeight}cm`;
  }
};

export default function OrderItemCard({ order }: OrderItemCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Đơn hàng #{order.orderNumber}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Đặt hàng: {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold" style={{color: '#E21C34'}}>
            {order.totalAmount.toLocaleString('vi-VN')}₫
          </p>
          <p className="text-sm text-gray-600">
            {order.orderItems.length} sản phẩm
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {order.orderItems.slice(0, 2).map((item) => {
          const product = productInfo[item.productType];
          return (
            <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg" style={{backgroundColor: '#fcf8ef'}}>
              <div className="w-14 h-18 bg-white rounded-lg flex items-center justify-center border overflow-hidden shadow-sm">
                <CartDesignPreview
                  previewImageUrl={item.designPreviewUrl}
                  designSession={item.designData ? JSON.parse(item.designData) : undefined}
                  designName={item.designName}
                  size="small"
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {item.designName}
                </p>
                <p className="text-sm text-gray-600">
                  {formatOrderItemDescription(item)} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {item.totalPrice.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          );
        })}
        
        {order.orderItems.length > 2 && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">
              và {order.orderItems.length - 2} sản phẩm khác...
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p>Giao đến: <span className="font-medium">{order.deliveryAddress}</span></p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/orders/${order.id}`}
            className="px-4 py-2 border rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
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
            <EyeIcon className="w-4 h-4" />
            <span>Xem chi tiết</span>
          </Link>
          {order.status === OrderStatus.Pending && (
            <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center space-x-2">
              <XMarkIcon className="w-4 h-4" />
              <span>Hủy đơn</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
