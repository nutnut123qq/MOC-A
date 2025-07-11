'use client';

import React, { memo } from 'react';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { getTShirtImagePath } from '@/data/tshirt-options';
import { getPrintAreaBounds } from '@/utils/printAreaCalculator';
import ImageLayer from '@/components/tshirt-design/ImageLayer';

interface CartDesignPreviewProps {
  designSession?: TShirtDesignSession;
  previewImageUrl?: string;
  designName?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const CartDesignPreview = memo(function CartDesignPreview({
  designSession,
  previewImageUrl,
  designName = 'Design',
  className = '',
  size = 'small'
}: CartDesignPreviewProps) {
  // Kích thước canvas dựa trên size prop (tỷ lệ 4:5 như áo thun)
  const canvasSize = {
    small: { width: 60, height: 75 },
    medium: { width: 90, height: 112 },
    large: { width: 120, height: 150 }
  }[size];

  // Scale factor để scale down từ design editor (400x500) xuống cart size
  const scaleFactor = canvasSize.width / 400;

  // Nếu có preview image URL, sử dụng nó trước
  if (previewImageUrl) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="relative bg-white border border-gray-200 overflow-hidden rounded-lg"
          style={{
            width: canvasSize.width,
            height: canvasSize.height
          }}
        >
          <img
            src={previewImageUrl}
            alt={designName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  }



  // Nếu không có design session, return placeholder
  if (!designSession) {
    return (
      <div className={`relative ${className}`}>
        <div
          className="relative bg-gray-100 border border-gray-200 overflow-hidden rounded-lg flex items-center justify-center"
          style={{
            width: canvasSize.width,
            height: canvasSize.height
          }}
        >
          <span className="text-2xl">👕</span>
        </div>
      </div>
    );
  }

  // Set default print area nếu undefined
  const currentPrintArea = designSession.currentPrintArea || 'front';

  // Lấy layers cho print area hiện tại
  const currentLayers = designSession.designLayers.filter(
    layer => layer.printArea === currentPrintArea || (!layer.printArea && currentPrintArea === 'front')
  );



  // Lấy hình ảnh T-shirt
  const getTShirtImage = () => {
    const view = currentPrintArea === 'back' ? 'back' : 'front';
    return getTShirtImagePath(
      designSession.selectedSize,
      designSession.selectedColor,
      view
    );
  };

  // Lấy print area bounds và scale xuống
  const currentView = currentPrintArea;
  const currentSize = designSession.selectedSize || 'M';
  const originalBounds = getPrintAreaBounds(currentSize, currentView);
  
  const scaledBounds = {
    x: originalBounds.x * scaleFactor,
    y: originalBounds.y * scaleFactor,
    width: originalBounds.width * scaleFactor,
    height: originalBounds.height * scaleFactor,
  };

  return (
    <div className={`relative ${className}`}>
      {/* T-shirt Container */}
      <div
        className="relative bg-white border border-gray-200 overflow-hidden rounded-lg"
        style={{ 
          width: canvasSize.width, 
          height: canvasSize.height 
        }}
      >
        {/* T-shirt background image */}
        <div className="absolute inset-0">
          <img
            src={getTShirtImage()}
            alt={`Áo thun góc nhìn ${designSession.currentPrintArea === 'front' ? 'trước' : 'sau'}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = `https://via.placeholder.com/${canvasSize.width}x${canvasSize.height}/f8f9fa/6b7280?text=T-Shirt`;
            }}
          />
        </div>

        {/* Print Area Clipping Container */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: scaledBounds.x,
            top: scaledBounds.y,
            width: scaledBounds.width,
            height: scaledBounds.height,
          }}
        >
          {/* Design Layers */}
          {currentLayers.map((layer) => {
            // Scale layer position và size
            const scaledPosition = {
              x: (layer.position.x - originalBounds.x) * scaleFactor,
              y: (layer.position.y - originalBounds.y) * scaleFactor,
            };

            const scaledWidth = layer.style?.width ? 
              parseFloat(layer.style.width.toString()) * scaleFactor : 
              undefined;
            const scaledHeight = layer.style?.height ? 
              parseFloat(layer.style.height.toString()) * scaleFactor : 
              undefined;

            return (
              <div
                key={layer.id}
                className="absolute select-none pointer-events-none"
                style={{
                  left: scaledPosition.x,
                  top: scaledPosition.y,
                  transform: `rotate(${layer.transform?.rotation || 0}deg) scale(${layer.transform?.scaleX || 1}, ${layer.transform?.scaleY || 1})`,
                  width: scaledWidth,
                  height: scaledHeight,
                  fontSize: layer.style?.fontSize ? 
                    `${parseFloat(layer.style.fontSize.toString()) * scaleFactor}px` : 
                    undefined,
                  color: layer.style?.color,
                  fontFamily: layer.style?.fontFamily,
                  fontWeight: layer.style?.fontWeight,
                  fontStyle: layer.style?.fontStyle,
                  textAlign: layer.style?.textAlign,
                  backgroundColor: layer.style?.backgroundColor,
                  borderRadius: layer.style?.borderRadius,
                  opacity: layer.style?.opacity,
                }}
              >
                {layer.type === 'image' ? (
                  <ImageLayer
                    content={layer.content}
                    alt="Design element"
                    className="w-full h-full object-cover rounded pointer-events-none"
                    draggable={false}
                  />
                ) : layer.type === 'shape' ? (
                  <div
                    className="w-full h-full pointer-events-none"
                    style={{
                      backgroundColor: layer.style?.backgroundColor,
                      borderRadius: layer.content === 'circle' ? '50%' :
                                   layer.content === 'triangle' ? '0' : '4px',
                      clipPath: layer.content === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                               layer.content === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                               undefined,
                    }}
                  />
                ) : (
                  <div
                    className="pointer-events-none w-full h-full flex items-center justify-center"
                    style={{
                      whiteSpace: layer.style?.textAlign === 'center' ? 'nowrap' : 'pre-wrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {layer.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CartDesignPreview;
