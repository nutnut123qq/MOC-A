'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getTShirtImagePath } from '@/data/tshirt-options';
import { TShirtSizeType, TShirtColorType } from '@/types/tshirt-design';

interface RealisticTShirtMockupProps {
  color: string;
  size: TShirtSizeType;
  colorType: TShirtColorType;
  view: 'front' | 'back' | 'folded' | 'hanging';
  children?: React.ReactNode;
  className?: string;
}

export default function RealisticTShirtMockup({
  color,
  size,
  colorType,
  view,
  children,
  className = ''
}: RealisticTShirtMockupProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Get image path based on size, color, and view
  const getImagePath = () => {
    // For front and back views, use the áo vector collection
    if (view === 'front' || view === 'back') {
      const path = getTShirtImagePath(size, colorType, view);
      console.log(`Loading ${view} view image:`, path);
      return path;
    }
    // Fallback to SVG for other views until we have more images
    const path = `/mockups/tshirt-${view}-white.svg`;
    console.log('Loading SVG image:', path);
    return path;
  };

  // Get design overlay position based on view
  // Canvas print area: left: 128px, top: 155px, width: 138px, height: 171px
  // T-shirt mockup: 500x600px
  // Overlay area: larger than canvas for better visibility (35% x 40% = 175px x 240px)
  const getDesignOverlayStyle = () => {
    switch (view) {
      case 'front':
        return {
          position: 'absolute' as const,
          // Center the larger overlay area on the T-shirt
          left: '52%',
          top: '49%',
          transform: 'translate(-50%, -50%)',
          width: '39%', // 175px (larger than canvas 138px)
          height: '42%', // 240px (larger than canvas 171px)
          zIndex: 10,
          pointerEvents: 'none' as const,
        };
      case 'back':
        return {
          position: 'absolute' as const,
          left: '50%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
          width: '35%',
          height: '40%',
          zIndex: 10,
          pointerEvents: 'none' as const,
        };
      case 'folded':
        return {
          position: 'absolute' as const,
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%) perspective(800px) rotateX(25deg)',
          width: '32%',
          height: '35%',
          zIndex: 10,
          pointerEvents: 'none' as const,
        };
      case 'hanging':
        return {
          position: 'absolute' as const,
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%) perspective(600px) rotateY(8deg)',
          width: '33%',
          height: '37%',
          zIndex: 10,
          pointerEvents: 'none' as const,
        };
      default:
        return {};
    }
  };

  // Fallback to placeholder if image not found
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('❌ Image failed to load:', getImagePath());
    console.error('❌ Error event:', e);
    const img = e.target as HTMLImageElement;
    console.log('🔄 Trying fallback image...');

    // Don't fallback, keep trying the JPEG
    if (img.src.includes('tshirt_mockup.jpeg')) {
      console.log('🔄 JPEG failed, trying direct path...');
      // Try with different path format
      img.src = 'http://localhost:3002/mockups/tshirt_mockup.jpeg';
    } else {
      console.log('🔄 Using SVG fallback');
      img.src = '/mockups/tshirt-front-white.svg';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading Spinner */}
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* T-shirt Image Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative" style={{ width: '500px', height: '600px' }}>
          {!imageError ? (
            <Image
              src={getImagePath()}
              alt={`Áo thun góc nhìn ${view === 'front' ? 'trước' : view === 'back' ? 'sau' : view}`}
              fill
              className="object-cover"
              priority={view === 'front'}
              quality={85}
              onLoad={() => {
                setImageLoading(false);
                console.log('✅ Image loaded successfully:', getImagePath());
              }}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
                console.error('❌ Image failed to load:', getImagePath());
              }}
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.15))'
              }}
            />
          ) : (
            // Fallback SVG
            <img
              src={`/mockups/tshirt-front-white.svg`}
              alt={`T-shirt ${view} view (fallback)`}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoading(false)}
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.15))'
              }}
            />
          )}

          {/* Design Overlay */}
          <div
            style={getDesignOverlayStyle()}
            className="overflow-hidden"
          >
            {children}
          </div>



          {/* Color Filter Overlay (if not white) */}
          {color !== '#ffffff' && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: color,
                mixBlendMode: 'multiply',
                opacity: 0.7,
                maskImage: `url(${getImagePath()})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
