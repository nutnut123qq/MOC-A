'use client';

import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';

interface TShirtPanelProps {
  tshirt: TShirt;
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
  onPreview?: () => void;
}

export default function TShirtPanel({ tshirt, designSession, onSessionUpdate, onPreview }: TShirtPanelProps) {
  const currentVariant = tshirt.variants.find(v => v.color === designSession.selectedColor) || tshirt.variants[0];
  const currentSize = currentVariant.sizes.find(s => s.size === designSession.selectedSize) || currentVariant.sizes[0];

  const handleColorChange = (color: string) => {
    onSessionUpdate({
      ...designSession,
      selectedColor: color,
    });
  };

  const handleSizeChange = (size: string) => {
    onSessionUpdate({
      ...designSession,
      selectedSize: size,
    });
  };

  const calculatePrice = () => {
    const basePrice = tshirt.basePrice;
    const sizePrice = currentSize.price || 0;
    const layerCount = designSession.designLayers.length;
    const designPrice = layerCount * 10000; // 10k per layer

    return basePrice + sizePrice + designPrice;
  };

  const getStyleIcon = () => {
    switch (tshirt.style) {
      case 'hoodie': return '🧥';
      case 'tank_top': return '🎽';
      case 'long_sleeve': return '👔';
      default: return '👕';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tùy Chọn Sản Phẩm</h3>
        <p className="text-sm text-gray-500">Tùy chỉnh áo thun của bạn</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Product Info */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">{getStyleIcon()}</div>
            <div>
              <h4 className="font-semibold text-gray-900">{tshirt.name}</h4>
              <p className="text-sm text-gray-500">{tshirt.brand}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Material:</span>
              <span className="font-medium">{tshirt.specifications.material}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{tshirt.specifications.weight}g</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fit:</span>
              <span className="font-medium capitalize">{tshirt.specifications.fit}</span>
            </div>
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">
            Color: <span className="text-blue-600">{currentVariant.colorName}</span>
          </h5>
          <div className="grid grid-cols-4 gap-3">
            {tshirt.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleColorChange(variant.color)}
                className={`aspect-square rounded-lg border-2 transition-all ${
                  designSession.selectedColor === variant.color
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: variant.colorHex }}
                title={variant.colorName}
              >
                {designSession.selectedColor === variant.color && (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">
            Size: <span className="text-blue-600">{designSession.selectedSize}</span>
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {currentVariant.sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => handleSizeChange(size.size)}
                disabled={!size.available}
                className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                  designSession.selectedSize === size.size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : size.available
                    ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {size.size}
              </button>
            ))}
          </div>
        </div>

        {/* Print Areas */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Print Areas</h5>
          <div className="space-y-2">
            {tshirt.printAreas.map((printArea) => {
              const layerCount = designSession.designLayers.filter(
                layer => layer.printArea === printArea.name
              ).length;

              return (
                <div
                  key={printArea.id}
                  className={`p-3 rounded-lg border transition-all ${
                    designSession.currentPrintArea === printArea.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{printArea.displayName}</span>
                    <span className="text-sm text-gray-500">{layerCount} layers</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Max: {printArea.maxDimensions.width} × {printArea.maxDimensions.height} px
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Design Guidelines */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Hướng Dẫn Thiết Kế</h5>
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Thực Hành Tốt Nhất:</div>
                <ul className="space-y-1 text-xs">
                  <li>• Sử dụng hình ảnh độ phân giải cao (300 DPI)</li>
                  <li>• Giữ thiết kế trong vùng in</li>
                  <li>• Tránh text quá nhỏ (tối thiểu 12pt)</li>
                  <li>• Sử dụng chế độ màu RGB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Price & Actions */}
      <div className="border-t border-gray-200 p-6 space-y-4">
        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base price:</span>
            <span>{tshirt.basePrice.toLocaleString('vi-VN')} ₫</span>
          </div>
          {currentSize.price && currentSize.price > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Size surcharge:</span>
              <span>{currentSize.price.toLocaleString('vi-VN')} ₫</span>
            </div>
          )}
          {designSession.designLayers.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Design ({designSession.designLayers.length} layers):</span>
              <span>{(designSession.designLayers.length * 10000).toLocaleString('vi-VN')} ₫</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-blue-600">{calculatePrice().toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {onPreview && (
            <button
              onClick={onPreview}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              🔍 Xem Trước Mockup
            </button>
          )}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Thêm Vào Giỏ Hàng
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Lưu Thiết Kế
          </button>
        </div>
      </div>
    </div>
  );
}
