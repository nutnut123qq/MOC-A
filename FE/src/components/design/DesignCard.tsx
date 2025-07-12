'use client';

import { Design } from '@/lib/design-api';
import { getTShirtImagePath } from '@/data/tshirt-options';
import { getPrintAreaBounds } from '@/utils/printAreaCalculator';
import ImageLayer from '@/components/tshirt-design/ImageLayer';

interface DesignCardProps {
  design: Design;
  onEdit: () => void;
  onDelete: () => void;
  onClone: () => void;
}

export default function DesignCard({ design, onEdit, onDelete }: DesignCardProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLayerCount = () => {
    return design.designSession?.designLayers?.length || 0;
  };

  const getDesignInfo = () => {
    const session = design.designSession;
    return {
      productName: 'Classic Cotton T-Shirt',
      sizeInfo: `Size: ${session?.selectedSize || 'M'}`,
      colorInfo: `Màu: ${session?.selectedColor || 'white'}`,
      layerCount: getLayerCount(),
      dateInfo: formatDate(design.createdAt)
    };
  };

  const designInfo = getDesignInfo();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: '1px solid #e5e7eb'
    }}>
      {/* DESIGN PREVIEW WITH T-SHIRT */}
      <div style={{
        width: '100%',
        height: '200px',
        position: 'relative',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {design.designSession ? (
          <DesignPreviewRenderer
            designSession={design.designSession}
            canvasWidth={160}
            canvasHeight={200}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px' }}>👕</div>
            <div style={{ fontSize: '14px' }}>No Design</div>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {design.name}
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '8px'
        }}>
          <span>👕 {designInfo.productName}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          <span>{designInfo.sizeInfo}</span>
          <span>{designInfo.colorInfo}</span>
          <span>{designInfo.layerCount} lớp</span>
        </div>

        <div style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '8px'
        }}>
          {designInfo.dateInfo}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px'
        }}>
          <button
            onClick={onEdit}
            style={{
              backgroundColor: '#E21C34',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c41e3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E21C34';
            }}
          >
            Chỉnh sửa
          </button>
          <button
            onClick={onDelete}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
          >
            🗑️ Xóa
          </button>
        </div>
      </div>


    </div>
  );
}

// Component để render preview design với áo vector
function DesignPreviewRenderer({
  designSession,
  canvasWidth,
  canvasHeight
}: {
  designSession: any;
  canvasWidth: number;
  canvasHeight: number;
}) {
  // Scale factor để scale down từ design editor (400x500) xuống card size
  const scaleFactor = canvasWidth / 400;

  // Set default print area nếu undefined
  const currentPrintArea = designSession.currentPrintArea || 'front';

  // Lấy layers cho print area hiện tại
  const currentLayers = designSession.designLayers?.filter(
    (layer: any) => layer.printArea === currentPrintArea || (!layer.printArea && currentPrintArea === 'front')
  ) || [];

  // Lấy hình ảnh T-shirt
  const getTShirtImage = () => {
    const view = currentPrintArea === 'back' ? 'back' : 'front';
    return getTShirtImagePath(
      designSession.selectedSize || 'M',
      designSession.selectedColor || 'white',
      view
    );
  };

  // Lấy print area bounds và scale xuống
  const currentSize = designSession.selectedSize || 'M';
  const originalBounds = getPrintAreaBounds(currentSize, currentPrintArea);

  const scaledBounds = {
    x: originalBounds.x * scaleFactor,
    y: originalBounds.y * scaleFactor,
    width: originalBounds.width * scaleFactor,
    height: originalBounds.height * scaleFactor,
  };

  return (
    <div style={{
      position: 'relative',
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff'
    }}>
      {/* T-shirt background image */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <img
          src={getTShirtImage()}
          alt={`Áo thun góc nhìn ${currentPrintArea === 'front' ? 'trước' : 'sau'}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = `https://via.placeholder.com/${canvasWidth}x${canvasHeight}/f8f9fa/6b7280?text=T-Shirt`;
          }}
        />
      </div>

      {/* Print Area Clipping Container */}
      <div style={{
        position: 'absolute',
        left: scaledBounds.x,
        top: scaledBounds.y,
        width: scaledBounds.width,
        height: scaledBounds.height,
        overflow: 'hidden'
      }}>
        {/* Design Layers */}
        {currentLayers.map((layer: any) => {
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
              style={{
                position: 'absolute',
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
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              {layer.type === 'image' ? (
                <ImageLayer
                  content={layer.content}
                  alt="Design element"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                  draggable={false}
                />
              ) : layer.type === 'shape' ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: layer.style?.backgroundColor,
                  borderRadius: layer.content === 'circle' ? '50%' :
                               layer.content === 'triangle' ? '0' : '4px',
                  clipPath: layer.content === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                           layer.content === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                           undefined,
                }} />
              ) : (
                // Text layer
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {layer.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
