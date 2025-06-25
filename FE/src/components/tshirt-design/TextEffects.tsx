'use client';

import React from 'react';
import { LayerStyle } from '@/types/tshirt-design';
import Icon from '@/components/ui/Icon';

interface TextEffectsProps {
  style: LayerStyle;
  onStyleChange: (style: LayerStyle) => void;
  text: string;
}

export default function TextEffects({ style, onStyleChange, text }: TextEffectsProps) {
  const updateStyle = (updates: Partial<LayerStyle>) => {
    onStyleChange({ ...style, ...updates });
  };

  const effectPresets = [
    {
      name: 'Rainbow Gradient',
      icon: 'gradient',
      style: {
        gradient: {
          type: 'linear' as const,
          colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
          direction: 45,
        },
        color: '#FF0000', // fallback
      }
    },
    {
      name: 'Sunset Glow',
      icon: 'gradient',
      style: {
        gradient: {
          type: 'linear' as const,
          colors: ['#FF6B6B', '#FFE66D', '#FF6B6B'],
          direction: 90,
        },
        color: '#FF6B6B',
      }
    },
    {
      name: 'Ocean Wave',
      icon: 'gradient',
      style: {
        gradient: {
          type: 'linear' as const,
          colors: ['#667eea', '#764ba2'],
          direction: 135,
        },
        color: '#667eea',
      }
    },
    {
      name: 'Pink Dream',
      icon: 'heart',
      style: {
        gradient: {
          type: 'radial' as const,
          colors: ['#FF69B4', '#FFB6C1', '#FFC0CB'],
        },
        color: '#FF69B4',
      }
    },
    {
      name: 'Gold Shine',
      icon: 'star',
      style: {
        gradient: {
          type: 'linear' as const,
          colors: ['#FFD700', '#FFA500', '#FFD700'],
          direction: 45,
        },
        color: '#FFD700',
        textStroke: {
          width: 1,
          color: '#B8860B',
        },
      }
    },
    {
      name: 'Neon Glow',
      icon: 'zap',
      style: {
        color: '#00FFFF',
        textStroke: {
          width: 2,
          color: '#0080FF',
        },
        shadow: {
          offsetX: 0,
          offsetY: 0,
          blur: 10,
          color: '#00FFFF',
        },
      }
    },
  ];

  const shadowPresets = [
    { name: 'Soft Shadow', shadow: { offsetX: 2, offsetY: 2, blur: 4, color: '#00000040' } },
    { name: 'Hard Shadow', shadow: { offsetX: 3, offsetY: 3, blur: 0, color: '#000000' } },
    { name: 'Glow Effect', shadow: { offsetX: 0, offsetY: 0, blur: 8, color: '#FF69B4' } },
    { name: 'Double Shadow', shadow: { offsetX: 4, offsetY: 4, blur: 2, color: '#00000060' } },
  ];

  return (
    <div className="space-y-6">
      {/* Effect Presets */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Effect Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {effectPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => updateStyle(preset.style)}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="mb-2 flex justify-center">
                <Icon name={preset.icon} size={20} className="text-gray-600 group-hover:text-blue-600" />
              </div>
              <div className="text-xs font-medium text-gray-700 group-hover:text-blue-600">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Gradient */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Gradient</h4>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={() => updateStyle({
                gradient: {
                  type: 'linear',
                  colors: ['#FF0000', '#0000FF'],
                  direction: 45,
                }
              })}
              className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                style.gradient?.type === 'linear'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => updateStyle({
                gradient: {
                  type: 'radial',
                  colors: ['#FF0000', '#0000FF'],
                }
              })}
              className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                style.gradient?.type === 'radial'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Radial
            </button>
          </div>

          {style.gradient && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Color 1</label>
                <input
                  type="color"
                  value={style.gradient.colors[0] || '#FF0000'}
                  onChange={(e) => updateStyle({
                    gradient: {
                      ...style.gradient,
                      colors: [e.target.value, style.gradient.colors[1] || '#0000FF']
                    }
                  })}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Color 2</label>
                <input
                  type="color"
                  value={style.gradient.colors[1] || '#0000FF'}
                  onChange={(e) => updateStyle({
                    gradient: {
                      ...style.gradient,
                      colors: [style.gradient.colors[0] || '#FF0000', e.target.value]
                    }
                  })}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              {style.gradient.type === 'linear' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Direction: {style.gradient.direction || 0}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={style.gradient.direction || 0}
                    onChange={(e) => updateStyle({
                      gradient: {
                        ...style.gradient,
                        direction: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shadow Effects */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Shadow Effects</h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {shadowPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => updateStyle({ shadow: preset.shadow })}
              className="p-2 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => updateStyle({ shadow: undefined })}
          className="w-full p-2 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
        >
          Remove Shadow
        </button>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
        <div className="flex justify-center">
          <div
            className="text-2xl font-bold"
            style={{
              fontFamily: style.fontFamily,
              fontSize: Math.min(style.fontSize || 24, 32),
              color: style.gradient ? 'transparent' : style.color,
              background: style.gradient ?
                style.gradient.type === 'linear'
                  ? `linear-gradient(${style.gradient.direction || 0}deg, ${style.gradient.colors.join(', ')})`
                  : `radial-gradient(circle, ${style.gradient.colors.join(', ')})`
                : undefined,
              WebkitBackgroundClip: style.gradient ? 'text' : undefined,
              WebkitTextFillColor: style.gradient ? 'transparent' : undefined,
              WebkitTextStroke: style.textStroke ?
                `${style.textStroke.width}px ${style.textStroke.color}` : undefined,
              textShadow: style.shadow ?
                `${style.shadow.offsetX}px ${style.shadow.offsetY}px ${style.shadow.blur}px ${style.shadow.color}` : undefined,
              fontWeight: style.fontWeight,
              textTransform: style.textTransform,
              letterSpacing: style.letterSpacing,
            }}
          >
            {text || 'Preview Text'}
          </div>
        </div>
      </div>

      {/* Clear All Effects */}
      <button
        onClick={() => updateStyle({
          gradient: undefined,
          textStroke: undefined,
          shadow: undefined,
        })}
        className="w-full p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
      >
        🗑️ Clear All Effects
      </button>
    </div>
  );
}
