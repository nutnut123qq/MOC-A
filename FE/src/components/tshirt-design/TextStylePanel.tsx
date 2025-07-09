'use client';

import React, { useState } from 'react';
import { LayerStyle } from '@/types/tshirt-design';
import { fontFamilies } from '@/data/fonts';
import CurvedTextEditor from './CurvedTextEditor';
import TextEffects from './TextEffects';
import Icon from '@/components/ui/Icon';

interface TextStylePanelProps {
  style: LayerStyle;
  onStyleChange: (style: LayerStyle) => void;
  text: string;
  onTextChange: (text: string) => void;
}

export default function TextStylePanel({
  style,
  onStyleChange,
  text,
  onTextChange
}: TextStylePanelProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'effects' | 'curved'>('text');

  const updateStyle = (updates: Partial<LayerStyle>) => {
    onStyleChange({ ...style, ...updates });
  };

  const currentFont = fontFamilies.find(f => f.name === style.fontFamily);
  const availableWeights = currentFont?.variants || [{ weight: '400', style: 'normal', displayName: 'Thường' }];

  const colorPresets = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'text', label: 'Text', icon: 'edit' },
          { id: 'style', label: 'Kiểu', icon: 'palette' },
          { id: 'effects', label: 'Hiệu Ứng', icon: 'sparkles' },
          { id: 'curved', label: 'Cong', icon: 'curve' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon name={tab.icon} size={14} className="mr-1" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Text Tab */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội Dung Text
            </label>
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Nhập text của bạn..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kích Thước Font
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="8"
                max="120"
                value={style.fontSize || 24}
                onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-[40px]">
                {style.fontSize || 24}px
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Căn Chỉnh Text
            </label>
            <div className="flex space-x-1">
              {[
                { value: 'left', icon: '⬅️', label: 'Trái' },
                { value: 'center', icon: '↔️', label: 'Giữa' },
                { value: 'right', icon: '➡️', label: 'Phải' },
              ].map(align => (
                <button
                  key={align.value}
                  onClick={() => updateStyle({ textAlign: align.value as any })}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                    style.textAlign === align.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={align.label}
                >
                  {align.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ Đậm Font
            </label>
            <select
              value={style.fontWeight || '400'}
              onChange={(e) => updateStyle({ fontWeight: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {availableWeights.map(weight => (
                <option key={`${weight.weight}-${weight.style}`} value={weight.weight}>
                  {weight.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Màu Text
            </label>
            <div className="space-y-2">
              <input
                type="color"
                value={style.color || '#000000'}
                onChange={(e) => updateStyle({ color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <div className="grid grid-cols-5 gap-1">
                {colorPresets.map(color => (
                  <button
                    key={color}
                    onClick={() => updateStyle({ color })}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      style.color === color ? 'border-amber-500 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biến Đổi Text
            </label>
            <select
              value={style.textTransform || 'none'}
              onChange={(e) => updateStyle({ textTransform: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">Bình Thường</option>
              <option value="uppercase">CHỮ HOA</option>
              <option value="lowercase">chữ thường</option>
              <option value="capitalize">Viết Hoa Đầu Từ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng Cách Chữ
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-2"
                max="10"
                step="0.5"
                value={style.letterSpacing || 0}
                onChange={(e) => updateStyle({ letterSpacing: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-[40px]">
                {style.letterSpacing || 0}px
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {activeTab === 'effects' && (
        <TextEffects
          style={style}
          onStyleChange={onStyleChange}
          text={text}
        />
      )}

      {/* Curved Tab */}
      {activeTab === 'curved' && (
        <CurvedTextEditor
          text={text}
          style={style}
          onTextChange={onTextChange}
          onStyleChange={onStyleChange}
        />
      )}
    </div>
  );
}
