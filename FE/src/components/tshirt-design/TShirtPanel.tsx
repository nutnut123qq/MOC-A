'use client';

import { useState } from 'react';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession, DesignLayer } from '@/types/tshirt-design';
import { getPrintAreaBounds, getMaxDimensions } from '@/utils/printAreaCalculator';
import AddToCartButton from '@/components/ui/AddToCartButton';

interface TShirtPanelProps {
  tshirt: TShirt;
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
  onPreview?: () => void;
  savedDesignId?: number | null;
}

// Decal size options - 5 size phổ biến
const DECAL_SIZES = [
  { id: 'size-5', range: '5cm', width: 5, height: 5, description: 'Nhỏ gọn (logo, text)' },
  { id: 'size-10', range: '10cm', width: 10, height: 10, description: 'Phổ biến nhất', popular: true },
  { id: 'size-15', range: '15cm', width: 15, height: 15, description: 'Nổi bật trên áo', popular: true },
  { id: 'size-20', range: '20cm', width: 20, height: 20, description: 'Lớn, thiết kế chi tiết' },
  { id: 'size-25', range: '25cm', width: 25, height: 25, description: 'Cực lớn, full design' },
];

export default function TShirtPanel({ tshirt, designSession, onSessionUpdate, onPreview, savedDesignId }: TShirtPanelProps) {
  const [showDecalSizeSelector, setShowDecalSizeSelector] = useState(false);

  const currentVariant = tshirt.variants.find(v => v.color === designSession.selectedColor) || tshirt.variants[0];
  const currentSize = currentVariant.sizes.find(s => s.size === designSession.selectedSize) || currentVariant.sizes[0];

  // Auto-open decal size selector for new designs - Temporarily disabled
  // useEffect(() => {
  //   if (!designSession.decalSize && designSession.designLayers.length === 0) {
  //     // Small delay to let the page load first
  //     const timer = setTimeout(() => {
  //       setShowDecalSizeSelector(true);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [designSession.decalSize, designSession.designLayers.length]);

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

  const handleDecalSizeSelect = (decalSize: typeof DECAL_SIZES[0]) => {
    // Create decal frame as a design layer
    const CM_TO_PX_RATIO = 7;
    const frameWidth = decalSize.width * CM_TO_PX_RATIO;
    const frameHeight = decalSize.height * CM_TO_PX_RATIO;

    // Get print area bounds to center the frame
    const currentView = designSession.currentPrintArea || 'front';
    const currentSize = designSession.selectedSize || 'M';
    const dynamicBounds = getPrintAreaBounds(currentSize, currentView);

    const centerX = dynamicBounds.x + (dynamicBounds.width - frameWidth) / 2;
    const centerY = dynamicBounds.y + (dynamicBounds.height - frameHeight) / 2;

    const newDecalFrame: DesignLayer = {
      id: `decal-frame-${Date.now()}`,
      type: 'decal-frame',
      content: `Decal Frame ${decalSize.range}`,
      position: { x: centerX, y: centerY },
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        width: frameWidth,
        height: frameHeight,
      },
      decalSize: {
        width: decalSize.width,
        height: decalSize.height,
        range: decalSize.range,
      },
      visible: true,
      locked: false,
    };

    const updatedLayers = [...designSession.designLayers, newDecalFrame];
    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
    setShowDecalSizeSelector(false);
  };

  const calculatePrice = () => {
    return 149000; // Fixed price for all t-shirts
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






        {/* Decal Frames */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">
            Khung Decal
            {(() => {
              const decalFrames = designSession.designLayers.filter(layer =>
                layer.type === 'decal-frame' && layer.printArea === designSession.currentPrintArea
              );
              return decalFrames.length > 0 && (
                <span className="text-amber-600 ml-2">({decalFrames.length} khung)</span>
              );
            })()}
          </h5>

          <button
            onClick={() => setShowDecalSizeSelector(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all group"
          >
            <div className="text-center">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📏</div>
              <div className="font-medium text-gray-700 group-hover:text-amber-700">
                Thêm Khung Decal
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Tạo khung để đặt hình ảnh với kích thước cố định
              </div>
            </div>
          </button>
        </div>




      </div>

      {/* Footer - Price & Actions */}
      <div className="border-t border-gray-200 p-6 space-y-4">
        {/* Price */}
        <div className="text-center">
          <div className="text-2xl font-bold" style={{color: '#E21C34'}}>
            {calculatePrice().toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Giá sản phẩm
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
          {savedDesignId ? (
            <AddToCartButton
              designId={savedDesignId}
              productId={tshirt.id}
              sizeWidth={200} // Default size
              sizeHeight={200} // Default size
              className="w-full py-3 rounded-lg font-semibold"
            />
          ) : (
            <button
              className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
              disabled
              title="Vui lòng lưu thiết kế trước"
            >
              Thêm Vào Giỏ Hàng
            </button>
          )}
          <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Lưu Thiết Kế
          </button>
        </div>
      </div>

      {/* Decal Size Selector Modal */}
      {showDecalSizeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Chọn Kích Thước Decal</h2>
                  <p className="text-gray-600 mt-1">Thiết lập khung thiết kế cho decal</p>
                </div>
                <button
                  onClick={() => setShowDecalSizeSelector(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Size Options */}
            <div className="p-6">
              <div className="space-y-3">
                {DECAL_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleDecalSizeSelect(size)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 flex items-center">
                          <span className="text-lg font-bold text-blue-600">{size.range}</span>
                          {size.popular && (
                            <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                              Phổ biến
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{size.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Kích thước: {size.width} × {size.height} cm
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Visual size preview */}
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded">
                          <div
                            className="border-2 border-dashed border-blue-400 bg-blue-50"
                            style={{
                              width: `${Math.min(size.width * 2, 32)}px`,
                              height: `${Math.min(size.height * 2, 32)}px`,
                            }}
                          />
                        </div>
                        <div className="text-2xl">📏</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
