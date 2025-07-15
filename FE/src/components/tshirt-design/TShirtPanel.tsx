'use client';

import { useState, useEffect } from 'react';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession, DesignLayer, TShirtColorType, TShirtSizeType } from '@/types/tshirt-design';
import { ProductMode } from '@/types/product';
import { getPrintAreaBounds } from '@/utils/printAreaCalculator';
import { DEFAULT_PRODUCT_MODE, COMBO_PRICE, getProductPrice } from '@/data/tshirt-options';
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

  // Initialize productMode from designSession or use default
  const currentProductMode = designSession.productMode || DEFAULT_PRODUCT_MODE;

  // Sync productMode with designSession when it changes
  useEffect(() => {
    if (!designSession.productMode) {
      onSessionUpdate({
        ...designSession,
        productMode: DEFAULT_PRODUCT_MODE,
        comboPrice: DEFAULT_PRODUCT_MODE === ProductMode.COMBO ? COMBO_PRICE : undefined,
      });
    }
  }, [designSession, onSessionUpdate]);

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

  const handleColorChange = (color: TShirtColorType) => {
    onSessionUpdate({
      ...designSession,
      selectedColor: color,
    });
  };

  const handleSizeChange = (size: TShirtSizeType) => {
    onSessionUpdate({
      ...designSession,
      selectedSize: size,
    });
  };

  const handleProductModeChange = (mode: ProductMode) => {
    onSessionUpdate({
      ...designSession,
      productMode: mode,
      comboPrice: mode === ProductMode.COMBO ? COMBO_PRICE : undefined,
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

  // Tính giá decal theo công thức: (size + 5) * 1000
  const calculateDecalPrice = (size: number) => {
    return (size + 5) * 1000;
  };

  // Đếm số decal frames trong design
  const countDecalFrames = () => {
    return designSession.designLayers.filter(layer => layer.type === 'decal-frame').length;
  };

  // Tính tổng giá dựa trên product mode
  const calculateTotalPrice = () => {
    if (currentProductMode === ProductMode.COMBO) {
      return COMBO_PRICE; // Fixed price for T-shirt combo
    } else {
      // Decal only - tính theo số lượng và size từng element
      const decalFrames = designSession.designLayers.filter(layer => layer.type === 'decal-frame');
      let totalPrice = 0;

      if (decalFrames.length > 0) {
        // Có decal frames - tính theo size của từng frame
        decalFrames.forEach(frame => {
          if (frame.decalSize) {
            const size = Math.max(frame.decalSize.width, frame.decalSize.height);
            totalPrice += calculateDecalPrice(size);
          }
        });
      } else {
        // Không có decal frames nhưng có elements khác
        const otherElements = designSession.designLayers.filter(layer =>
          layer.type !== 'decal-frame' && layer.visible !== false
        );

        if (otherElements.length > 0) {
          // Có elements khác - tính theo size từng element
          otherElements.forEach(element => {
            let elementSize = 15; // Default 15cm

            // Nếu element có decalConstraints (từ decal frame đã convert)
            if (element.decalConstraints) {
              const constraintWidth = element.decalConstraints.maxWidth / 7; // Convert px to cm (7px = 1cm)
              const constraintHeight = element.decalConstraints.maxHeight / 7;
              elementSize = Math.max(constraintWidth, constraintHeight);
            } else if (element.style?.width && element.style?.height) {
              // Tính từ style size (convert px to cm)
              const styleWidth = element.style.width / 7;
              const styleHeight = element.style.height / 7;
              elementSize = Math.max(styleWidth, styleHeight);
            }

            totalPrice += calculateDecalPrice(elementSize);
          });
        }
      }



      return totalPrice || 0;
    }
  };

  const calculatePrice = () => {
    return calculateTotalPrice();
  };

  // Get size for AddToCart based on product mode
  const getCartSize = () => {
    if (currentProductMode === ProductMode.COMBO) {
      const size = { width: 200, height: 200 }; // Combo size (>= 150 triggers combo pricing in backend)

      return size;
    } else {
      // Decal-only: Calculate virtual size based on total price
      // Backend formula: (size + 5) * 1000 = price
      // So: size = (price / 1000) - 5

      const totalPrice = calculateTotalPrice();

      if (totalPrice > 0) {
        const virtualSize = (totalPrice / 1000) - 5;
        const size = { width: virtualSize, height: virtualSize };



        return size;
      }

      const defaultSize = { width: 10, height: 10 }; // Default 15k price

      return defaultSize;
    }
  };

  const getStyleIcon = () => {
    switch (tshirt.style) {
      case 'hoodie': return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L15 8.414V17a1 1 0 01-1 1H6a1 1 0 01-1-1V8.414L3.293 6.707A1 1 0 013 6V4z"/>
        </svg>
      );
      case 'tank_top': return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a1 1 0 000 2v12a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 100-2H6z"/>
        </svg>
      );
      case 'long_sleeve': return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
        </svg>
      );
      default: return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L15 8.414V17a1 1 0 01-1 1H6a1 1 0 01-1-1V8.414L3.293 6.707A1 1 0 013 6V4z"/>
        </svg>
      );
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

        {/* Product Type Selector */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Loại Sản Phẩm</h5>
          <div className="text-xs text-gray-600 mb-3">
            Chọn loại sản phẩm bạn muốn mua
          </div>
          <div className="grid grid-cols-1 gap-3">
            {/* Combo Option */}
            <button
              onClick={() => handleProductModeChange(ProductMode.COMBO)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                currentProductMode === ProductMode.COMBO
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-amber-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L15 8.414V17a1 1 0 01-1 1H6a1 1 0 01-1-1V8.414L3.293 6.707A1 1 0 013 6V4z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Combo Áo + Decal</div>
                  <div className="text-sm text-gray-600">Bao nhiêu decal cũng được</div>
                  <div className="text-lg font-bold text-amber-600 mt-1">{COMBO_PRICE.toLocaleString('vi-VN')}₫</div>
                </div>
                {currentProductMode === ProductMode.COMBO && (
                  <div className="text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Decal Only Option */}
            <button
              onClick={() => handleProductModeChange(ProductMode.DECAL_ONLY)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                currentProductMode === ProductMode.DECAL_ONLY
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-amber-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Chỉ Decal</div>
                  <div className="text-sm text-gray-600">Tính theo số lượng và size</div>
                  <div className="text-lg font-bold text-amber-600 mt-1">
                    {currentProductMode === ProductMode.DECAL_ONLY ? (
                      calculateTotalPrice() > 0
                        ? `${calculateTotalPrice().toLocaleString('vi-VN')}₫`
                        : 'Thêm elements để xem giá'
                    ) : `${getProductPrice(ProductMode.DECAL_ONLY, 20).toLocaleString('vi-VN')}₫`}
                  </div>
                </div>
                {currentProductMode === ProductMode.DECAL_ONLY && (
                  <div className="text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Decal Price Breakdown */}
          {currentProductMode === ProductMode.DECAL_ONLY && calculateTotalPrice() > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Chi tiết giá decal:</div>
              <div className="space-y-1">
                {/* Decal Frames */}
                {designSession.designLayers
                  .filter(layer => layer.type === 'decal-frame')
                  .map((frame, index) => {
                    if (!frame.decalSize) return null;
                    const size = Math.max(frame.decalSize.width, frame.decalSize.height);
                    const price = calculateDecalPrice(size);
                    return (
                      <div key={frame.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">Khung Decal {index + 1} ({size}cm)</span>
                        <span className="font-medium">{price.toLocaleString('vi-VN')}₫</span>
                      </div>
                    );
                  })}

                {/* Other Elements (when no decal frames) */}
                {countDecalFrames() === 0 && designSession.designLayers
                  .filter(layer => layer.type !== 'decal-frame' && layer.visible !== false)
                  .map((element, index) => {
                    let elementSize = 15; // Default

                    if (element.decalConstraints) {
                      const constraintWidth = element.decalConstraints.maxWidth / 7;
                      const constraintHeight = element.decalConstraints.maxHeight / 7;
                      elementSize = Math.max(constraintWidth, constraintHeight);
                    } else if (element.style?.width && element.style?.height) {
                      const styleWidth = element.style.width / 7;
                      const styleHeight = element.style.height / 7;
                      elementSize = Math.max(styleWidth, styleHeight);
                    }

                    const price = calculateDecalPrice(elementSize);
                    const typeLabel = element.type === 'text' ? 'Text' :
                                     element.type === 'image' ? 'Hình ảnh' :
                                     element.type === 'sticker' ? 'Sticker' : 'Element';

                    return (
                      <div key={element.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{typeLabel} {index + 1} (~{Math.round(elementSize)}cm)</span>
                        <span className="font-medium">{price.toLocaleString('vi-VN')}₫</span>
                      </div>
                    );
                  })}
              </div>
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Giá decal = (size + 5) × 1,000₫</span>
              </div>
            </div>
          )}

          {/* Decal Pricing Info */}
          {currentProductMode === ProductMode.DECAL_ONLY && calculateTotalPrice() === 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span>Cách tính giá decal:</span>
                </div>
                <div className="text-xs space-y-1">
                  <div>• 5cm = 10,000₫</div>
                  <div>• 10cm = 15,000₫</div>
                  <div>• 15cm = 20,000₫</div>
                  <div>• 20cm = 25,000₫</div>
                  <div>• 25cm = 30,000₫</div>
                </div>
                <div className="text-xs mt-2 font-medium">
                  Công thức: (size + 5) × 1,000₫
                </div>
                <div className="text-xs mt-2 text-blue-600 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Thêm khung decal hoặc hình ảnh/text để bắt đầu thiết kế</span>
                </div>
              </div>
            </div>
          )}
        </div>





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
              <div className="text-amber-600 mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
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
            {currentProductMode === ProductMode.COMBO ? (
              <span>Combo Áo + Decal (bao nhiêu decal cũng được)</span>
            ) : (
              <span>
                Chỉ Decal ({(() => {
                  const frames = countDecalFrames();
                  const otherElements = designSession.designLayers.filter(l =>
                    l.type !== 'decal-frame' && l.visible !== false
                  ).length;

                  if (frames > 0) {
                    return `${frames} khung decal`;
                  } else if (otherElements > 0) {
                    return `${otherElements} element${otherElements > 1 ? 's' : ''}`;
                  } else {
                    return '0 elements';
                  }
                })()})
              </span>
            )}
          </div>
          {currentProductMode === ProductMode.DECAL_ONLY && calculateTotalPrice() === 0 && (
            <div className="text-xs text-amber-600 mt-1">
              Thêm elements để tính giá
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {onPreview && (
            <button
              onClick={onPreview}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Xem Trước Mockup</span>
            </button>
          )}
          {savedDesignId ? (
            <AddToCartButton
              designId={savedDesignId}
              productId={tshirt.id}
              sizeWidth={getCartSize().width}
              sizeHeight={getCartSize().height}
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
                        <div className="text-blue-600">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                        </div>
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
