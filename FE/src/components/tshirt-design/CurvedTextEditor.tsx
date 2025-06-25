'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LayerStyle } from '@/types/tshirt-design';

interface CurvedTextEditorProps {
  text: string;
  style: LayerStyle;
  onTextChange: (text: string) => void;
  onStyleChange: (style: LayerStyle) => void;
}

export default function CurvedTextEditor({ 
  text, 
  style, 
  onTextChange, 
  onStyleChange 
}: CurvedTextEditorProps) {
  const [curvature, setCurvature] = useState(0);
  const [radius, setRadius] = useState(100);
  const svgRef = useRef<SVGSVGElement>(null);

  const updateStyle = (updates: Partial<LayerStyle>) => {
    onStyleChange({ ...style, ...updates });
  };

  // Generate curved text path
  const generateCurvedPath = (text: string, radius: number, curvature: number) => {
    const circumference = 2 * Math.PI * radius;
    const textLength = text.length;
    const anglePerChar = (circumference / textLength) * (curvature / 100);
    
    let path = '';
    const centerX = 150;
    const centerY = 150;
    
    for (let i = 0; i < textLength; i++) {
      const angle = (i - textLength / 2) * anglePerChar;
      const x = centerX + radius * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * Math.sin(angle - Math.PI / 2);
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path;
  };

  const curvedTextTemplates = [
    { name: 'Smile Curve', curvature: 30, radius: 80 },
    { name: 'Big Smile', curvature: 50, radius: 60 },
    { name: 'Arch', curvature: 20, radius: 100 },
    { name: 'Wave', curvature: 15, radius: 120 },
    { name: 'Circle', curvature: 100, radius: 50 },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-2">
        Curved Text Editor
      </div>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter curved text..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Curve Templates */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Curve Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {curvedTextTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setCurvature(template.curvature);
                setRadius(template.radius);
              }}
              className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Curvature Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Curvature: {curvature}%
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={curvature}
          onChange={(e) => setCurvature(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Radius Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Radius: {radius}px
        </label>
        <input
          type="range"
          min="30"
          max="200"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
        <div className="flex justify-center">
          <svg
            ref={svgRef}
            width="300"
            height="200"
            viewBox="0 0 300 200"
            className="border border-gray-200 rounded"
          >
            <defs>
              <path
                id="curve-path"
                d={`M 50 150 Q 150 ${150 - curvature} 250 150`}
                fill="none"
              />
            </defs>
            <text
              fontSize={style.fontSize || 16}
              fontFamily={style.fontFamily || 'Arial'}
              fill={style.color || '#000000'}
              fontWeight={style.fontWeight || '400'}
              textAnchor="middle"
            >
              <textPath href="#curve-path" startOffset="50%">
                {text || 'Curved Text'}
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* Style Controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="8"
              max="48"
              value={style.fontSize || 16}
              onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 min-w-[40px]">
              {style.fontSize || 16}px
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Color
          </label>
          <input
            type="color"
            value={style.color || '#000000'}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => {
          // Here you would apply the curved text settings
          // This is a simplified version - in a real implementation,
          // you'd need to store the curve parameters in the layer data
          updateStyle({
            ...style,
            // Store curve data for rendering
            curveData: {
              curvature,
              radius,
              type: 'curved'
            }
          });
        }}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Apply Curved Text
      </button>

      <div className="text-xs text-gray-500 text-center">
        💡 Tip: Adjust curvature and radius to create the perfect curve for your text
      </div>
    </div>
  );
}
