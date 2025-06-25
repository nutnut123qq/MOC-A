'use client';

import { useState } from 'react';
import { TShirt, TShirtStyle } from '@/types/tshirt';

interface TShirtSelectorProps {
  tshirts: TShirt[];
  onTShirtSelect: (tshirt: TShirt) => void;
}

export default function TShirtSelector({ tshirts, onTShirtSelect }: TShirtSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<TShirtStyle | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter t-shirts based on style and search
  const filteredTShirts = tshirts.filter(tshirt => {
    const matchesStyle = selectedStyle === 'all' || tshirt.style === selectedStyle;
    const matchesSearch = tshirt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tshirt.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStyle && matchesSearch && tshirt.isActive;
  });

  const getStyleName = (style: TShirtStyle): string => {
    const styleNames = {
      [TShirtStyle.BASIC_TEE]: 'Basic Tee',
      [TShirtStyle.PREMIUM_TEE]: 'Premium Tee',
      [TShirtStyle.TANK_TOP]: 'Tank Top',
      [TShirtStyle.LONG_SLEEVE]: 'Long Sleeve',
      [TShirtStyle.HOODIE]: 'Hoodie',
      [TShirtStyle.SWEATSHIRT]: 'Sweatshirt'
    };
    return styleNames[style] || style;
  };

  const getStyleIcon = (style: TShirtStyle): string => {
    const styleIcons = {
      [TShirtStyle.BASIC_TEE]: '👕',
      [TShirtStyle.PREMIUM_TEE]: '👕',
      [TShirtStyle.TANK_TOP]: '🎽',
      [TShirtStyle.LONG_SLEEVE]: '👔',
      [TShirtStyle.HOODIE]: '🧥',
      [TShirtStyle.SWEATSHIRT]: '🧥'
    };
    return styleIcons[style] || '👕';
  };

  const uniqueStyles = Array.from(new Set(tshirts.map(t => t.style)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chọn T-Shirt để bắt đầu thiết kế
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Chọn loại T-shirt phù hợp với ý tưởng thiết kế của bạn. 
          Mỗi sản phẩm có nhiều màu sắc và kích cỡ khác nhau.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên hoặc thương hiệu..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Style Filter */}
          <div className="lg:w-80">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại T-shirt
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as TShirtStyle | 'all')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả loại</option>
              {uniqueStyles.map(style => (
                <option key={style} value={style}>
                  {getStyleName(style)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Hiển thị <span className="font-semibold text-gray-900">{filteredTShirts.length}</span> sản phẩm
        </p>
        
        {(searchQuery || selectedStyle !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStyle('all');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* T-Shirt Grid */}
      {filteredTShirts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy T-shirt nào
          </h3>
          <p className="text-gray-600 mb-6">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStyle('all');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem tất cả T-shirts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTShirts.map((tshirt) => (
            <div
              key={tshirt.id}
              onClick={() => onTShirtSelect(tshirt)}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              {/* T-Shirt Preview */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                  {getStyleIcon(tshirt.style)}
                </div>
                
                {/* Color Variants Preview */}
                <div className="absolute bottom-4 left-4 flex space-x-1">
                  {tshirt.variants.slice(0, 4).map((variant, index) => (
                    <div
                      key={variant.id}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: variant.colorHex }}
                      title={variant.colorName}
                    />
                  ))}
                  {tshirt.variants.length > 4 && (
                    <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-sm flex items-center justify-center">
                      <span className="text-xs text-gray-600 font-bold">+</span>
                    </div>
                  )}
                </div>

                {/* Style Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  {getStyleName(tshirt.style)}
                </div>
              </div>

              {/* T-Shirt Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tshirt.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{tshirt.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {tshirt.basePrice.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tshirt.description}
                </p>

                {/* Features */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{tshirt.variants.length} màu</span>
                  <span>•</span>
                  <span>{tshirt.variants[0]?.sizes.length || 0} size</span>
                  <span>•</span>
                  <span>{tshirt.specifications.material}</span>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform group-hover:scale-105">
                  Bắt đầu thiết kế
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
