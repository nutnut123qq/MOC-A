'use client';

import React from 'react';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession, DesignLayer } from '@/types/tshirt-design';
import RealisticTShirtMockup from './RealisticTShirtMockup';

interface MockupRendererProps {
  tshirt: TShirt;
  designSession: TShirtDesignSession;
  view: 'front' | 'back' | 'folded' | 'hanging';
  className?: string;
}

export default function MockupRenderer({
  tshirt,
  designSession,
  view,
  className = ''
}: MockupRendererProps) {
  const currentVariant = tshirt.variants.find(v => v.color === designSession.selectedColor) || tshirt.variants[0];

  const currentPrintArea = tshirt.printAreas.find(pa =>
    (view === 'front' && pa.name === 'front') ||
    (view === 'back' && pa.name === 'back')
  );

  const currentLayers = designSession.designLayers.filter(layer =>
    layer.printArea === (view === 'front' ? 'front' : 'back') && layer.visible
  );

  const getTransformStyle = () => {
    switch (view) {
      case 'folded':
        return {
          transform: 'perspective(1200px) rotateX(20deg) rotateY(-15deg) scale(0.9)',
          transformStyle: 'preserve-3d' as const,
        };
      case 'hanging':
        return {
          transform: 'perspective(1000px) rotateY(8deg) scale(0.95)',
          transformStyle: 'preserve-3d' as const,
        };
      default:
        return {};
    }
  };

  const getTShirtStyle = () => {
    const baseStyle = {
      background: currentVariant.colorHex,
      clipPath: 'polygon(30% 0%, 70% 0%, 75% 8%, 85% 8%, 90% 12%, 95% 12%, 95% 18%, 90% 18%, 90% 100%, 10% 100%, 10% 18%, 5% 18%, 5% 12%, 10% 12%, 15% 8%, 25% 8%)',
      border: `2px solid ${currentVariant.colorHex}dd`,
    };

    switch (view) {
      case 'folded':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${currentVariant.colorHex} 0%, ${currentVariant.colorHex}dd 50%, ${currentVariant.colorHex}aa 100%)`,
          clipPath: 'polygon(25% 0%, 75% 0%, 80% 10%, 90% 10%, 95% 15%, 100% 15%, 100% 25%, 90% 25%, 90% 85%, 10% 85%, 10% 25%, 0% 25%, 0% 15%, 5% 15%, 10% 10%, 20% 10%)',
          filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4))',
          border: `2px solid ${currentVariant.colorHex}aa`,
        };
      case 'hanging':
        return {
          ...baseStyle,
          background: `linear-gradient(160deg, ${currentVariant.colorHex} 0%, ${currentVariant.colorHex}f0 70%, ${currentVariant.colorHex}dd 100%)`,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
          border: `2px solid ${currentVariant.colorHex}cc`,
        };
      default:
        return {
          ...baseStyle,
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))',
        };
    }
  };

  const getDesignTransform = () => {
    switch (view) {
      case 'folded':
        return 'perspective(800px) rotateX(15deg) rotateY(-5deg)';
      case 'hanging':
        return 'perspective(800px) rotateY(5deg)';
      default:
        return 'none';
    }
  };

  const renderLayer = (layer: DesignLayer) => {
    if (!currentPrintArea) return null;

    // Calculate scale to make mockup larger but maintain proportions
    // Canvas print area: left: 128px, top: 155px, width: 138px, height: 171px
    // Mockup T-shirt size: 500x600px
    // Mockup overlay area: we want it larger than canvas for better visibility

    const canvasPrintAreaWidth = currentPrintArea.bounds.width; // 138px
    const canvasPrintAreaHeight = currentPrintArea.bounds.height; // 171px

    // Mockup overlay area (larger than canvas for better visibility)
    const mockupTShirtWidth = 500;
    const mockupTShirtHeight = 600;
    const overlayWidthPercent = 0.35; // 35% of T-shirt width = 175px
    const overlayHeightPercent = 0.40; // 40% of T-shirt height = 240px
    const overlayWidth = mockupTShirtWidth * overlayWidthPercent;
    const overlayHeight = mockupTShirtHeight * overlayHeightPercent;

    // Calculate scale factor (mockup will be larger than canvas)
    const scaleX = overlayWidth / canvasPrintAreaWidth; // 175/138 ≈ 1.27
    const scaleY = overlayHeight / canvasPrintAreaHeight; // 240/171 ≈ 1.40
    const scale = Math.min(scaleX, scaleY); // Use smaller scale to maintain aspect ratio

    const layerStyle = {
      position: 'absolute' as const,
      left: (layer.position.x - currentPrintArea.bounds.x) * scale,
      top: (layer.position.y - currentPrintArea.bounds.y) * scale,
      transform: `rotate(${layer.transform.rotation}deg) scale(${layer.transform.scaleX * scale}, ${layer.transform.scaleY * scale})`,
      width: layer.style?.width ? `${parseInt(layer.style.width) * scale}px` : 'auto',
      height: layer.style?.height ? `${parseInt(layer.style.height) * scale}px` : 'auto',
      fontSize: layer.style?.fontSize ? `${parseInt(layer.style.fontSize) * scale}px` : undefined,
      fontFamily: layer.style?.fontFamily,
      color: layer.style?.color,
      backgroundColor: layer.style?.backgroundColor,
      opacity: (layer.style?.opacity || 1) * (view !== 'front' ? 0.9 : 1),
      filter: view === 'folded' ? 'brightness(0.85) contrast(1.1)' :
              view === 'hanging' ? 'brightness(0.95)' : 'none'
    };

    return (
      <div
        key={layer.id}
        style={layerStyle}
      >
        {layer.type === 'image' ? (
          <img
            src={layer.content}
            alt="Design element"
            className="w-full h-full object-cover rounded"
            draggable={false}
          />
        ) : layer.type === 'shape' ? (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: layer.style?.backgroundColor,
              borderRadius: layer.content === 'circle' ? '50%' : '4px',
              clipPath: layer.content === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                       layer.content === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                       undefined,
            }}
          />
        ) : (
          <span className="whitespace-nowrap select-none">
            {layer.content}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl" />

      {/* Mockup Container */}
      <div
        className="relative mx-auto flex items-center justify-center w-full h-full"
        style={{
          minHeight: '600px',
        }}
      >
        <RealisticTShirtMockup
          color={currentVariant.colorHex}
          view={view}
          className="w-full h-full"
        >
          {/* Design Layers */}
          {currentLayers.map(renderLayer)}
        </RealisticTShirtMockup>
      </div>
    </div>
  );
}
