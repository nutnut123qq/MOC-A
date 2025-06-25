'use client';

import React, { useState } from 'react';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import MockupRenderer from './MockupRenderer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  designSession: TShirtDesignSession;
  tshirt: TShirt;
  onSave: () => void;
  onAddToCart: () => void;
}

type MockupView = 'front' | 'back' | 'folded' | 'hanging';

export default function PreviewModal({
  isOpen,
  onClose,
  designSession,
  tshirt,
  onSave,
  onAddToCart
}: PreviewModalProps) {
  const [currentView, setCurrentView] = useState<MockupView>('front');

  if (!isOpen) return null;

  const currentVariant = tshirt.variants.find(v => v.color === designSession.selectedColor) || tshirt.variants[0];
  const currentSize = currentVariant.sizes.find(s => s.size === designSession.selectedSize) || currentVariant.sizes[0];

  const calculatePrice = () => {
    const basePrice = tshirt.basePrice;
    const sizePrice = currentSize.price || 0;
    const layerCount = designSession.designLayers.length;
    const designPrice = layerCount * 10000;
    return basePrice + sizePrice + designPrice;
  };

  const mockupViews = [
    { id: 'front', name: 'Front', icon: '👕' },
    { id: 'back', name: 'Back', icon: '🔄' },
    { id: 'folded', name: 'Folded', icon: '📦' },
    { id: 'hanging', name: 'Hanging', icon: '🪝' },
  ];

  const renderMockup = () => {
    return (
      <MockupRenderer
        tshirt={tshirt}
        designSession={designSession}
        view={currentView}
        className="w-full h-full"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">T-Shirt Preview</h2>
            <p className="text-sm text-gray-500 mt-1">
              {tshirt.name} • {currentVariant.colorName} • Size {designSession.selectedSize}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* View Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {mockupViews.map((view) => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id as MockupView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === view.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{view.icon}</span>
                <span>{view.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mockup Display */}
        <div className="p-8 bg-gray-50 flex items-center justify-center min-h-[600px]">
          <div className="w-full max-w-2xl">
            {renderMockup()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {calculatePrice().toLocaleString('vi-VN')} ₫
              </div>
              <div className="text-sm text-gray-500">
                {designSession.designLayers.length} design elements
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onSave}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Save Design
              </button>
              <button
                onClick={onAddToCart}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
