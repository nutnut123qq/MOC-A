'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { getBagImagePath } from '@/data/tshirt-options';
import ImageLayer from './ImageLayer';
import { getPrintAreaBounds } from '@/utils/printAreaCalculator';

interface BagCanvasProps {
  bag: TShirt;
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
}

export default function BagCanvas({ bag, designSession, onSessionUpdate }: BagCanvasProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [highlightedDecalFrame, setHighlightedDecalFrame] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [forceRender, setForceRender] = useState(0);

  const currentVariant = bag.variants[0]; // Only one variant for bag
  const currentPrintArea = bag.printAreas[0]; // Only one print area for bag
  const currentLayers = designSession.designLayers.filter(layer =>
    layer.printArea === 'front' && layer.visible // Always front for bag
  );

  // Force re-render when designSession changes
  useEffect(() => {
    setForceRender(prev => prev + 1);
  }, [designSession.designLayers.length]);

  const handleLayerClick = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLayerId(layerId);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedLayerId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && selectedLayerId) {
      const updatedLayers = designSession.designLayers.filter(layer => layer.id !== selectedLayerId);
      onSessionUpdate({
        ...designSession,
        designLayers: updatedLayers,
      });
      setSelectedLayerId(null);
    }
  };

  // Zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(3, prev + 0.2));
  const zoomOut = () => setZoomLevel(prev => Math.max(0.5, prev - 0.2));

  // Get bag image (always the same)
  const getBagImage = () => {
    return getBagImagePath();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Simplified Header - No size/color/view options */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Túi Canvas</h3>
            <span className="text-sm text-gray-500">Kích thước: 35x40cm</span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="flex-1 bg-white overflow-auto relative"
        onWheel={handleWheel}
      >
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${zoomLevel})`,
            transformOrigin: 'center',
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Bag Mockup */}
          <div
            ref={canvasRef}
            className="relative bg-white shadow-xl border border-gray-200 overflow-hidden cursor-default rounded-lg"
            style={{ width: 350, height: 450 }}
            onClick={handleCanvasClick}
            onKeyDown={handleKeyDown as React.KeyboardEventHandler}
            tabIndex={0}
          >
            {/* Bag background image */}
            <div className="absolute inset-0">
              <img
                src={getBagImage()}
                alt="Túi canvas"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "https://via.placeholder.com/400x500/f8f9fa/6b7280?text=Mockup+Tui+Canvas";
                }}
              />
            </div>

            {/* Print Area Boundary */}
            {(() => {
              // Fixed bounds for bag - positioned on the bag body (lower part)
              const dynamicBounds = { x: 75, y: 250, width: 200, height: 150 };

              return (
                <div
                  className="absolute border-2 border-dashed border-amber-500 bg-amber-50/10 rounded-sm pointer-events-none"
                  style={{
                    left: dynamicBounds.x,
                    top: dynamicBounds.y,
                    width: dynamicBounds.width,
                    height: dynamicBounds.height,
                  }}
                >
                </div>
              );
            })()}

            {/* Print Area Clipping Container */}
            {(() => {
              const dynamicBounds = { x: 75, y: 250, width: 200, height: 150 };

              return (
                <div
                  className="absolute overflow-hidden"
                  style={{
                    left: dynamicBounds.x,
                    top: dynamicBounds.y,
                    width: dynamicBounds.width,
                    height: dynamicBounds.height,
                  }}
                >
                  {/* Design Layers */}
                  {currentLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`absolute cursor-pointer ${
                        selectedLayerId === layer.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        left: layer.position.x,
                        top: layer.position.y,
                        width: layer.size.width,
                        height: layer.size.height,
                        transform: `rotate(${layer.rotation || 0}deg)`,
                        zIndex: layer.zIndex || 1,
                      }}
                      onClick={(e) => handleLayerClick(layer.id, e)}
                    >
                      {layer.type === 'image' && (
                        <ImageLayer
                          content={layer.content}
                          alt={`Design layer ${layer.id}`}
                        />
                      )}
                      {layer.type === 'text' && (
                        <div
                          style={{
                            fontSize: layer.style?.fontSize || 16,
                            fontFamily: layer.style?.fontFamily || 'Arial',
                            color: layer.style?.color || '#000000',
                            fontWeight: layer.style?.fontWeight || 'normal',
                            textAlign: (layer.style?.textAlign as any) || 'left',
                          }}
                          className="w-full h-full flex items-center justify-center pointer-events-none"
                        >
                          {layer.content}
                        </div>
                      )}
                      {layer.type === 'sticker' && (
                        <ImageLayer
                          content={layer.content}
                          alt={`Sticker ${layer.id}`}
                        />
                      )}

                      {/* Selection handles */}
                      {selectedLayerId === layer.id && (
                        <>
                          {/* Resize handles */}
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-nw-resize"></div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-ne-resize"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-sw-resize"></div>
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-se-resize"></div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
