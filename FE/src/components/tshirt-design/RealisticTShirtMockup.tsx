'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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

  // Get 3D mockup image path based on view
  const getImagePath = () => {
    // Use realistic 3D mockup images for preview (not vector images)
    // Updated to use new white front and back mockup images
    switch (view) {
      case 'front':
        return '/mockups/white f.png'; // New white front view mockup
      case 'back':
        return '/mockups/white b.png'; // New white back view mockup
      case 'folded':
        return '/mockups/tshirt-folded-mockup.jpeg'; // Placeholder (same as front for now)
      case 'hanging':
        return '/mockups/tshirt-hanging-mockup.jpeg'; // Placeholder (same as front for now)
      default:
        return '/mockups/white f.png'; // Default to new white front mockup
    }
  };

  // Get design overlay position based on view
  // Canvas print area Size L: left: 120px, top: 145px, width: 155px, height: 190px (canvas 400x500px)
  // T-shirt mockup: 500x600px
  // Overlay area: khớp với print area size L
  const getDesignOverlayStyle = () => {
    switch (view) {
      case 'front':
        return {
          position: 'absolute' as const,
          // Khớp với print area size L front: x:120, y:145, w:155, h:190
          left: '30%', // 120/400 = 30% → 30% của mockup 500px
          top: '29%', // 145/500 = 29% → 29% của mockup 600px
          transform: 'none',
          width: '38.75%', // 155/400 = 38.75% → 38.75% của mockup 500px
          height: '38%', // 190/500 = 38% → 38% của mockup 600px
          zIndex: 10,
          pointerEvents: 'none' as const,
        };
      case 'back':
        return {
          position: 'absolute' as const,
          // Điều chỉnh để khớp với canvas vector back
          left: '31%', // Điều chỉnh vị trí ngang
          top: '30%', // Điều chỉnh vị trí dọc để không bị cắt phần trên
          transform: 'none',
          width: '34%', // Giảm width để khớp với canvas
          height: '34%', // Giảm height để khớp với canvas
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

  // Fallback to main 3D mockup if specific view not found
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;

    // If specific view image fails, fallback to white front mockup
    if (!img.src.includes('white f.png')) {
      img.src = '/mockups/white f.png';
    } else {
      img.src = '/mockups/placeholder-tshirt.png';
    }
    setImageError(true);
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
              }}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.15))',
                // Cắt phần trên và dưới của ảnh mockup để căn giữa design với decal
                objectPosition: view === 'front' ? 'center 35%' : 'center 25%',
                // Điều chỉnh scale và dịch chuyển cho front và back
                transform: view === 'front'
                  ? 'scale(1.25) translateY(-10%)'
                  : 'scale(1.15) translateY(-5%)',
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
                maskPosition: view === 'front' ? 'center 35%' : 'center 25%',
                // Đồng bộ transform với ảnh chính cho cả front và back
                transform: view === 'front'
                  ? 'scale(1.25) translateY(-10%)'
                  : 'scale(1.15) translateY(-5%)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
