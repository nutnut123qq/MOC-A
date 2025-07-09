'use client';

import React, { useState } from 'react';
import { getImageSource, isImageLoading, getPlaceholderImageUrl, getErrorImageUrl } from '@/utils/imageUtils';

interface ImageLayerProps {
  content: any;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  draggable?: boolean;
}

export default function ImageLayer({
  content,
  alt = "Design element",
  className = "w-full h-full object-cover rounded pointer-events-none",
  style,
  onLoad,
  onError,
  draggable = false
}: ImageLayerProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log('🖼️ ImageLayer: Rendering with content:', content);

  // Handle loading state
  if (isImageLoading(content)) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`}
        style={style}
      >
        <div className="text-center text-gray-500">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-xs">Đang tải...</div>
        </div>
      </div>
    );
  }

  const imageSource = getImageSource(content);

  // Handle case where no valid image source
  if (!imageSource) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-red-50 border-2 border-dashed border-red-300`}
        style={style}
      >
        <div className="text-center text-red-500">
          <div className="text-xs">Lỗi ảnh</div>
        </div>
      </div>
    );
  }

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    onError?.();
    console.error('❌ Failed to load image:', imageSource);
  };

  // Show error state
  if (imageError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-red-50 border-2 border-dashed border-red-300`}
        style={style}
      >
        <div className="text-center text-red-500">
          <div className="text-xs">Không tải được</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 z-10">
          <div className="text-center text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-1"></div>
            <div className="text-xs">Loading...</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={imageSource}
        alt={alt}
        className={className}
        style={style}
        draggable={draggable}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
