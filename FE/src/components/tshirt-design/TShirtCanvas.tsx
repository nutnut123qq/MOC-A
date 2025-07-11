'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { getTShirtImagePath } from '@/data/tshirt-options';
import TShirtOptionsPanel from './TShirtOptionsPanel';
import ImageLayer from './ImageLayer';
import { getPrintAreaBounds } from '@/utils/printAreaCalculator';

interface TShirtCanvasProps {
  tshirt: TShirt;
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
}

export default function TShirtCanvas({ tshirt, designSession, onSessionUpdate }: TShirtCanvasProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [forceRender, setForceRender] = useState(0);

  const currentVariant = tshirt.variants.find(v => v.color === designSession.selectedColor) || tshirt.variants[0];
  const currentPrintArea = tshirt.printAreas.find(pa => pa.name === designSession.currentPrintArea);
  const currentLayers = designSession.designLayers.filter(layer =>
    layer.printArea === designSession.currentPrintArea && layer.visible
  );

  // Force re-render khi designSession thay đổi để đảm bảo print area hiển thị
  useEffect(() => {
    setForceRender(prev => prev + 1);
  }, [designSession.currentPrintArea, designSession.selectedSize, designSession.selectedColor, designSession.designLayers.length]);

  const handleLayerClick = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLayerId(layerId);
  };

  const handleCanvasClick = () => {
    setSelectedLayerId(null);
  };

  const handleLayerDoubleClick = (layerId: string) => {
    const layer = currentLayers.find(l => l.id === layerId);
    if (layer?.type === 'text') {
      const newText = prompt('Chỉnh sửa text:', layer.content);
      if (newText !== null) {
        const updatedLayers = designSession.designLayers.map(l =>
          l.id === layerId ? { ...l, content: newText } : l
        );
        onSessionUpdate({
          ...designSession,
          designLayers: updatedLayers,
        });
      }
    }
  };

  const deleteSelectedLayer = () => {
    if (selectedLayerId) {
      const updatedLayers = designSession.designLayers.filter(l => l.id !== selectedLayerId);
      onSessionUpdate({
        ...designSession,
        designLayers: updatedLayers,
      });
      setSelectedLayerId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && selectedLayerId) {
      deleteSelectedLayer();
    }
  };

  // Drag functionality
  const startDragging = (e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    setIsDragging(true);
    setSelectedLayerId(layerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const layer = currentLayers.find(l => l.id === layerId);
    if (!layer) return;

    const startPosition = { ...layer.position };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / zoomLevel;
      const deltaY = (e.clientY - startY) / zoomLevel;

      const updatedLayers = designSession.designLayers.map(l =>
        l.id === layerId
          ? {
              ...l,
              position: {
                x: startPosition.x + deltaX,
                y: startPosition.y + deltaY,
              },
            }
          : l
      );

      onSessionUpdate({
        ...designSession,
        designLayers: updatedLayers,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Resize functionality
  const startResizing = (e: React.MouseEvent, layerId: string, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);

    const startX = e.clientX;
    const startY = e.clientY;
    const layer = currentLayers.find(l => l.id === layerId);
    if (!layer) return;

    const startLayerState = {
      position: { ...layer.position },
      style: { ...layer.style },
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / zoomLevel;
      const deltaY = (e.clientY - startY) / zoomLevel;

      let newWidth = startLayerState.style?.width || 100;
      let newHeight = startLayerState.style?.height || 100;
      let newX = startLayerState.position.x;
      let newY = startLayerState.position.y;

      // Handle different resize directions
      switch (handle) {
        case 'nw':
          newWidth = Math.max(20, newWidth - deltaX);
          newHeight = Math.max(20, newHeight - deltaY);
          newX = startLayerState.position.x + deltaX;
          newY = startLayerState.position.y + deltaY;
          break;
        case 'ne':
          newWidth = Math.max(20, newWidth + deltaX);
          newHeight = Math.max(20, newHeight - deltaY);
          newY = startLayerState.position.y + deltaY;
          break;
        case 'sw':
          newWidth = Math.max(20, newWidth - deltaX);
          newHeight = Math.max(20, newHeight + deltaY);
          newX = startLayerState.position.x + deltaX;
          break;
        case 'se':
          newWidth = Math.max(20, newWidth + deltaX);
          newHeight = Math.max(20, newHeight + deltaY);
          break;
        case 'n':
          newHeight = Math.max(20, newHeight - deltaY);
          newY = startLayerState.position.y + deltaY;
          break;
        case 's':
          newHeight = Math.max(20, newHeight + deltaY);
          break;
        case 'w':
          newWidth = Math.max(20, newWidth - deltaX);
          newX = startLayerState.position.x + deltaX;
          break;
        case 'e':
          newWidth = Math.max(20, newWidth + deltaX);
          break;
      }

      const updatedLayers = designSession.designLayers.map(l =>
        l.id === layerId
          ? {
              ...l,
              position: { x: newX, y: newY },
              style: {
                ...l.style,
                width: newWidth,
                height: newHeight,
                fontSize: layer.type === 'text' ? Math.max(8, (newHeight * 0.8)) : l.style?.fontSize
              }
            }
          : l
      );

      onSessionUpdate({
        ...designSession,
        designLayers: updatedLayers,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle('');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Rotation functionality
  const startRotating = (e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);

    const layer = currentLayers.find(l => l.id === layerId);
    if (!layer || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + layer.position.x + (layer.style?.width || 0) / 2;
    const centerY = rect.top + layer.position.y + (layer.style?.height || 0) / 2;

    const getAngle = (clientX: number, clientY: number) => {
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    };

    const startAngle = getAngle(e.clientX, e.clientY);
    const startRotation = layer.transform.rotation;

    const handleMouseMove = (e: MouseEvent) => {
      const currentAngle = getAngle(e.clientX, e.clientY);
      const deltaAngle = currentAngle - startAngle;
      const newRotation = startRotation + deltaAngle;

      const updatedLayers = designSession.designLayers.map(l =>
        l.id === layerId
          ? {
              ...l,
              transform: {
                ...l.transform,
                rotation: newRotation,
              },
            }
          : l
      );

      onSessionUpdate({
        ...designSession,
        designLayers: updatedLayers,
      });
    };

    const handleMouseUp = () => {
      setIsRotating(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(3, prev + 0.2));
  const zoomOut = () => setZoomLevel(prev => Math.max(0.5, prev - 0.2));

  // Handle view change (front/back)
  const handleViewChange = (view: 'front' | 'back') => {
    onSessionUpdate({
      ...designSession,
      currentPrintArea: view,
    });
  };

  // Get T-shirt image based on current view, size, and color
  const getTShirtImage = () => {
    const view = designSession.currentPrintArea === 'back' ? 'back' : 'front';
    return getTShirtImagePath(
      designSession.selectedSize,
      designSession.selectedColor,
      view
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* T-Shirt Options Panel */}
      <TShirtOptionsPanel
        designSession={designSession}
        onSessionUpdate={onSessionUpdate}
      />

      {/* Header Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewChange('front')}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  designSession.currentPrintArea === 'front'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Front View"
              >
                👕 Front
              </button>
              <button
                onClick={() => handleViewChange('back')}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  designSession.currentPrintArea === 'back'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Back View"
              >
                🔄 Back
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={zoomOut}
                className="p-2 hover:bg-white rounded transition-colors"
                title="Zoom Out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-2 hover:bg-white rounded transition-colors"
                title="Zoom In"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Print Area Info */}
            {currentPrintArea && (
              <div className="text-sm text-gray-500">
                Max: {currentPrintArea.maxDimensions.width} × {currentPrintArea.maxDimensions.height} px
                <span className="ml-2 text-blue-600">• Elements can extend outside print area</span>
              </div>
            )}

            {/* Layer Actions */}
            {selectedLayerId && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={deleteSelectedLayer}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            )}
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
          {/* T-Shirt Mockup */}
          <div
            ref={canvasRef}
            className="relative bg-white shadow-xl border border-gray-200 overflow-hidden cursor-default rounded-lg"
            style={{ width: 400, height: 500 }}
            onClick={handleCanvasClick}
            onKeyDown={handleKeyDown as React.KeyboardEventHandler}
            tabIndex={0}
          >
            {/* T-shirt background image */}
            <div className="absolute inset-0">
              <img
                src={getTShirtImage()}
                alt={`Áo thun góc nhìn ${designSession.currentPrintArea === 'front' ? 'trước' : 'sau'}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "https://via.placeholder.com/400x500/f8f9fa/6b7280?text=Mockup+Ao+Thun";
                }}
              />
            </div>

            {/* Print Area Boundary */}
            {(() => {
              const currentView = designSession.currentPrintArea || 'front';
              const currentSize = designSession.selectedSize || 'M';

              // Lấy bounds động dựa trên size và view
              const dynamicBounds = getPrintAreaBounds(currentSize, currentView);



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
              const currentView = designSession.currentPrintArea || 'front';
              const currentSize = designSession.selectedSize || 'M';
              const dynamicBounds = getPrintAreaBounds(currentSize, currentView);



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
                {/* Design Layers - Clipped versions (only visible parts within print area) */}
                {currentLayers.map((layer) => {
                  return (
                    <div
                      key={layer.id}
                      className={`absolute select-none ${
                        selectedLayerId === layer.id
                          ? 'ring-2 ring-amber-500 ring-offset-1'
                          : 'hover:ring-1 hover:ring-amber-300'
                      } ${
                        isDragging && selectedLayerId === layer.id ? 'opacity-75 cursor-grabbing' :
                        isResizing && selectedLayerId === layer.id ? 'cursor-crosshair' :
                        isRotating && selectedLayerId === layer.id ? 'cursor-grab' :
                        'cursor-move'
                      }`}
                      style={{
                        left: layer.position.x - dynamicBounds.x,
                        top: layer.position.y - dynamicBounds.y,
                        transform: `rotate(${layer.transform?.rotation || 0}deg) scale(${layer.transform?.scaleX || 1}, ${layer.transform?.scaleY || 1})`,
                        width: layer.style?.width,
                        height: layer.style?.height,
                        fontSize: layer.style?.fontSize,
                        fontFamily: layer.style?.fontFamily,
                        fontWeight: layer.style?.fontWeight,
                        fontStyle: layer.style?.fontStyle,
                        textDecoration: layer.style?.textDecoration,
                        textAlign: layer.style?.textAlign,
                        textTransform: layer.style?.textTransform,
                        letterSpacing: layer.style?.letterSpacing,
                        lineHeight: layer.style?.lineHeight,
                        color: layer.style?.gradient ? 'transparent' : layer.style?.color,
                        backgroundColor: layer.style?.backgroundColor,
                        border: layer.style?.borderWidth ? `${layer.style.borderWidth}px solid ${layer.style.borderColor}` : undefined,
                        opacity: layer.style?.opacity || 1,
                        WebkitTextStroke: layer.style?.textStroke ?
                          `${layer.style.textStroke.width}px ${layer.style.textStroke.color}` : undefined,
                        background: layer.style?.gradient ?
                          layer.style.gradient.type === 'linear'
                            ? `linear-gradient(${layer.style.gradient.direction || 0}deg, ${layer.style.gradient.colors.join(', ')})`
                            : `radial-gradient(circle, ${layer.style.gradient.colors.join(', ')})`
                          : undefined,
                        WebkitBackgroundClip: layer.style?.gradient ? 'text' : undefined,
                        WebkitTextFillColor: layer.style?.gradient ? 'transparent' : undefined,
                        textShadow: layer.style?.shadow ?
                          `${layer.style.shadow.offsetX}px ${layer.style.shadow.offsetY}px ${layer.style.shadow.blur}px ${layer.style.shadow.color}` : undefined,
                      }}
                      onClick={(e) => handleLayerClick(layer.id, e)}
                      onMouseDown={(e) => {
                        if (!isResizing && !isRotating) {
                          startDragging(e, layer.id);
                        }
                      }}
                      onDoubleClick={() => handleLayerDoubleClick(layer.id)}
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

                      {/* Selection Handles */}
                      {selectedLayerId === layer.id && (
                        <>
                          {/* Corner Resize Handles */}
                          <div
                            className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-nw-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 'nw');
                            }}
                            title="Resize diagonally"
                          ></div>
                          <div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-ne-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 'ne');
                            }}
                            title="Resize diagonally"
                          ></div>
                          <div
                            className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-sw-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 'sw');
                            }}
                            title="Resize diagonally"
                          ></div>
                          <div
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-se-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 'se');
                            }}
                            title="Resize diagonally"
                          ></div>

                          {/* Edge Resize Handles */}
                          <div
                            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white cursor-n-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 'n');
                            }}
                            title="Resize vertically"
                          ></div>
                          <div
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white cursor-s-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 's');
                            }}
                            title="Resize vertically"
                          ></div>
                          <div
                            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white cursor-w-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 'w');
                            }}
                            title="Resize horizontally"
                          ></div>
                          <div
                            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white cursor-e-resize z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startResizing(e, layer.id, 'e');
                            }}
                            title="Resize horizontally"
                          ></div>

                          {/* Rotation Handle */}
                          <div
                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white cursor-grab z-20 touch-none"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startRotating(e, layer.id);
                            }}
                            title="Rotate element"
                          ></div>

                          {/* Rotation Line */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-green-500"></div>
                        </>
                      )}
                    </div>
                  );
                })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
