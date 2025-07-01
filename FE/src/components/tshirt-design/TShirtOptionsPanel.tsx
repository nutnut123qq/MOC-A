'use client';

import React from 'react';
import { TShirtDesignSession, TShirtSizeType, TShirtColorType } from '@/types/tshirt-design';
import { TSHIRT_SIZES, TSHIRT_COLORS, getSizeInfo, getColorInfo } from '@/data/tshirt-options';

interface TShirtOptionsPanelProps {
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
}

export default function TShirtOptionsPanel({ designSession, onSessionUpdate }: TShirtOptionsPanelProps) {
  const handleSizeChange = (size: TShirtSizeType) => {
    onSessionUpdate({
      ...designSession,
      selectedSize: size,
    });
  };

  const handleColorChange = (color: TShirtColorType) => {
    onSessionUpdate({
      ...designSession,
      selectedColor: color,
    });
  };

  const currentSizeInfo = getSizeInfo(designSession.selectedSize);
  const currentColorInfo = getColorInfo(designSession.selectedColor);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Size Selector */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Kích thước:</label>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {TSHIRT_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSizeChange(size.id)}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    designSession.selectedSize === size.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={size.displayName}
                >
                  {size.id.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {currentSizeInfo?.displayName}
            </span>
          </div>

          {/* Color Selector */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Màu:</label>
            <div className="flex items-center space-x-2">
              {TSHIRT_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    designSession.selectedColor === color.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  title={color.displayName}
                >
                  {color.id === 'white' && (
                    <div className="w-full h-full rounded-full border border-gray-200" />
                  )}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {currentColorInfo?.displayName}
            </span>
          </div>
        </div>

        {/* Current Selection Info */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Đang chọn:</span> {currentSizeInfo?.displayName} - {currentColorInfo?.displayName}
        </div>
      </div>
    </div>
  );
}
