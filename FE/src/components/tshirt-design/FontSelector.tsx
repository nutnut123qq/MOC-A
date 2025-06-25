'use client';

import React, { useState } from 'react';
import { FontFamily } from '@/types/tshirt-design';
import { fontFamilies } from '@/data/fonts';
import Icon from '@/components/ui/Icon';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (fontFamily: string) => void;
  previewText?: string;
}

export default function FontSelector({
  selectedFont,
  onFontChange,
  previewText = 'Sample Text'
}: FontSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Fonts', icon: 'type' },
    { id: 'cute', name: 'Cute', icon: 'heart' },
    { id: 'handwriting', name: 'Handwriting', icon: 'handwriting' },
    { id: 'display', name: 'Display', icon: 'display' },
    { id: 'sans-serif', name: 'Sans Serif', icon: 'serif' },
    { id: 'decorative', name: 'Decorative', icon: 'decorative' },
  ];

  const filteredFonts = fontFamilies.filter(font => {
    const matchesSearch = font.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         font.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search fonts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-2 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon name={category.icon} size={12} className="mr-1" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Font List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredFonts.map(font => (
          <div
            key={font.id}
            onClick={() => onFontChange(font.name)}
            className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedFont === font.name
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {font.displayName}
                </span>
                {font.googleFont && (
                  <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-600 rounded">
                    Google
                  </span>
                )}
                {font.isPremium && (
                  <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-600 rounded">
                    Premium
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 capitalize">
                {font.category}
              </span>
            </div>

            {/* Font Preview */}
            <div
              className="text-lg text-gray-800 truncate"
              style={{
                fontFamily: font.name,
                fontWeight: font.variants[0]?.weight || '400'
              }}
            >
              {font.previewText || previewText}
            </div>

            {/* Font Variants */}
            {font.variants.length > 1 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {font.variants.slice(0, 4).map(variant => (
                  <span
                    key={`${variant.weight}-${variant.style}`}
                    className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                  >
                    {variant.displayName}
                  </span>
                ))}
                {font.variants.length > 4 && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    +{font.variants.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFonts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-2xl mb-2">🔍</div>
          <div className="text-sm">No fonts found</div>
          <div className="text-xs text-gray-400 mt-1">
            Try adjusting your search or filter
          </div>
        </div>
      )}
    </div>
  );
}
