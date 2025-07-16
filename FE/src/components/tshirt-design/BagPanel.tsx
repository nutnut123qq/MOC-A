'use client';

import { useState, useEffect } from 'react';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession, DesignLayer } from '@/types/tshirt-design';
import { ProductMode } from '@/types/product';
import { DEFAULT_PRODUCT_MODE, COMBO_PRICE, getProductPrice, calculateDecalPrice } from '@/data/tshirt-options';
import AddToCartButton from '@/components/ui/AddToCartButton';

interface BagPanelProps {
  bag: TShirt;
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
  onPreview?: () => void;
  savedDesignId?: number | null;
}

export default function BagPanel({ bag, designSession, onSessionUpdate, onPreview, savedDesignId }: BagPanelProps) {
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

  const handleProductModeChange = (mode: ProductMode) => {
    onSessionUpdate({
      ...designSession,
      productMode: mode,
      comboPrice: mode === ProductMode.COMBO ? COMBO_PRICE : undefined,
    });
  };

  // Count decal frames in design
  const countDecalFrames = () => {
    return designSession.designLayers.filter(layer => layer.type === 'decal-frame').length;
  };

  // Calculate total price based on product mode
  const calculateTotalPrice = () => {
    if (currentProductMode === ProductMode.COMBO) {
      return COMBO_PRICE; // Fixed price for bag combo
    } else {
      // Decal only - calculate based on quantity and size of each element
      const decalFrames = designSession.designLayers.filter(layer => layer.type === 'decal-frame');
      let totalPrice = 0;

      decalFrames.forEach(frame => {
        if (frame.decalSize) {
          totalPrice += calculateDecalPrice(frame.decalSize);
        }
      });

      // If no decal frames, calculate based on other elements
      if (decalFrames.length === 0) {
        const otherElements = designSession.designLayers.filter(layer => 
          layer.type !== 'decal-frame' && layer.visible
        );

        otherElements.forEach(element => {
          // Estimate size based on element dimensions (convert px to cm roughly)
          const elementSize = Math.max(
            (element.size?.width || 50) / 10, // rough px to cm conversion
            (element.size?.height || 50) / 10
          );
          
          // Clamp between 5cm and 28cm
          const clampedSize = Math.max(5, Math.min(28, elementSize));
          totalPrice += calculateDecalPrice(clampedSize);
        });
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
      const size = { width: 200, height: 200 }; // Combo size
      return size;
    } else {
      // Decal-only: Calculate virtual size based on total price
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tùy Chọn Sản Phẩm</h3>
        <p className="text-sm text-gray-500">Tùy chỉnh túi canvas của bạn</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Product Info - Simplified for bag */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sản phẩm:</span>
              <span className="font-medium">Túi Canvas</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kích thước:</span>
              <span className="font-medium">35x40cm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Màu sắc:</span>
              <span className="font-medium">Trắng</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Chất liệu:</span>
              <span className="font-medium">100% Cotton Canvas</span>
            </div>
          </div>
        </div>

        {/* Product Mode Selection */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Loại sản phẩm</h4>
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="productMode"
                value={ProductMode.COMBO}
                checked={currentProductMode === ProductMode.COMBO}
                onChange={() => handleProductModeChange(ProductMode.COMBO)}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Combo Túi + Decal</span>
                  <span className="text-sm font-bold text-red-600">149,000₫</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Túi canvas + in decal theo thiết kế (không giới hạn số lượng decal)
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="productMode"
                value={ProductMode.DECAL_ONLY}
                checked={currentProductMode === ProductMode.DECAL_ONLY}
                onChange={() => handleProductModeChange(ProductMode.DECAL_ONLY)}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Chỉ Decal</span>
                  <span className="text-sm font-bold text-red-600">
                    {calculatePrice().toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ in decal theo thiết kế (giá tính theo kích thước từng decal)
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Price Breakdown for Decal Only */}
        {currentProductMode === ProductMode.DECAL_ONLY && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Chi tiết giá</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {designSession.designLayers
                .filter(layer => layer.visible && layer.type !== 'decal-frame')
                .map((element, index) => {
                  const elementSize = Math.max(
                    (element.size?.width || 50) / 10,
                    (element.size?.height || 50) / 10
                  );
                  const clampedSize = Math.max(5, Math.min(28, elementSize));
                  const price = calculateDecalPrice(clampedSize);
                  const typeLabel = element.type === 'text' ? 'Text' :
                                   element.type === 'image' ? 'Hình ảnh' :
                                   element.type === 'sticker' ? 'Sticker' : 'Element';

                  return (
                    <div key={element.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{typeLabel} {index + 1} (~{Math.round(clampedSize)}cm)</span>
                      <span className="font-medium">{price.toLocaleString('vi-VN')}₫</span>
                    </div>
                  );
                })}

              {designSession.designLayers.filter(layer => layer.visible).length === 0 && (
                <div className="text-sm text-gray-500 text-center py-2">
                  Chưa có element nào trong thiết kế
                </div>
              )}

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{calculatePrice().toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Stats */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Thống kê thiết kế</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Số lớp thiết kế:</span>
              <span className="font-medium">{designSession.designLayers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Lớp hiển thị:</span>
              <span className="font-medium">
                {designSession.designLayers.filter(layer => layer.visible).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 space-y-3">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Tổng tiền:</span>
          <span className="text-red-600">{calculatePrice().toLocaleString('vi-VN')}₫</span>
        </div>

        <div className="space-y-2">
          {onPreview && (
            <button
              onClick={onPreview}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Xem Trước
            </button>
          )}

          {savedDesignId ? (
            <AddToCartButton
              designId={savedDesignId}
              productId={bag.id}
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
        </div>
      </div>
    </div>
  );
}
