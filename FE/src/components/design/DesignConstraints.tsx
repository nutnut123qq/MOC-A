'use client';

import React from 'react';
import { DecalSize } from './DecalSizeSelector';

interface DesignConstraintsProps {
  decalSize: DecalSize;
  layerCount: number;
  showTips?: boolean;
}

export default function DesignConstraints({ 
  decalSize, 
  layerCount, 
  showTips = true 
}: DesignConstraintsProps) {
  const getConstraintStatus = () => {
    if (layerCount === 0) return 'empty';
    if (layerCount <= 3) return 'good';
    if (layerCount <= 5) return 'warning';
    return 'danger';
  };

  const status = getConstraintStatus();

  const statusConfig = {
    empty: {
      color: 'text-gray-500',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: '📐',
      message: 'Bắt đầu thiết kế trong khung'
    },
    good: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: '✅',
      message: 'Thiết kế trong giới hạn tối ưu'
    },
    warning: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '⚠️',
      message: 'Nhiều layer, cân nhắc tối ưu'
    },
    danger: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '🚫',
      message: 'Quá nhiều layer, có thể ảnh hưởng chất lượng'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`p-4 rounded-lg border ${config.bg} ${config.border}`}>
      <div className="flex items-start space-x-3">
        <div className="text-xl">{config.icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-medium ${config.color}`}>
              Khung Thiết Kế: {decalSize.range}
            </h4>
            <span className="text-sm text-gray-500">
              {layerCount} layer{layerCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <div>Kích thước: {decalSize.width} × {decalSize.height} cm</div>
            <div className={config.color}>{config.message}</div>
          </div>

          {showTips && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-medium">💡 Mẹo thiết kế:</div>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Giữ thiết kế trong khung màu xanh</li>
                <li>• Tránh đặt text quá gần viền</li>
                <li>• Sử dụng ít layer để chất lượng tốt nhất</li>
                {decalSize.width <= 15 && (
                  <li>• Khung nhỏ: Thiết kế đơn giản, text lớn</li>
                )}
                {decalSize.width >= 20 && (
                  <li>• Khung lớn: Có thể thiết kế chi tiết hơn</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
