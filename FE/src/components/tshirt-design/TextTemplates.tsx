'use client';

import React, { useState } from 'react';
import { TextTemplate, TextCategory } from '@/types/tshirt-design';
import { textCategories } from '@/data/textTemplates';
import Icon from '@/components/ui/Icon';

interface TextTemplatesProps {
  onTemplateSelect: (template: TextTemplate) => void;
}

export default function TextTemplates({ onTemplateSelect }: TextTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('cute');
  const [searchTerm, setSearchTerm] = useState('');

  const currentCategory = textCategories.find(cat => cat.id === selectedCategory);
  const filteredTemplates = currentCategory?.templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.previewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search templates..."
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

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1">
        {textCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon name={category.icon} size={16} className="mr-2" />
            {category.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-blue-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                {template.name}
              </h4>
              {template.isPremium && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                  Premium
                </span>
              )}
            </div>

            {/* Template Preview */}
            <div
              className="text-center py-4 bg-gray-50 rounded-lg mb-3 group-hover:bg-blue-50 transition-colors"
              style={{
                fontFamily: template.style.fontFamily,
                fontSize: Math.min(template.style.fontSize || 24, 20),
                color: template.style.color,
                fontWeight: template.style.fontWeight,
                fontStyle: template.style.fontStyle,
                textDecoration: template.style.textDecoration,
                textTransform: template.style.textTransform,
                letterSpacing: template.style.letterSpacing,
                textAlign: template.style.textAlign,
                WebkitTextStroke: template.style.textStroke ?
                  `${template.style.textStroke.width}px ${template.style.textStroke.color}` : undefined,
                opacity: template.style.opacity,
              }}
            >
              {template.previewText}
            </div>

            {/* Template Info */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="font-medium">
                {template.style.fontFamily}
              </span>
              <span>
                {template.style.fontSize}px
              </span>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-2xl mb-2">🎨</div>
          <div className="text-sm">No templates found</div>
          <div className="text-xs text-gray-400 mt-1">
            Try adjusting your search or category
          </div>
        </div>
      )}

      {/* Quick Add Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onTemplateSelect({
            id: 'custom',
            name: 'Custom Text',
            category: 'cute',
            previewText: 'Your Text Here',
            style: {
              fontSize: 24,
              fontFamily: 'Pacifico',
              color: '#FF69B4',
              fontWeight: '400',
              textAlign: 'center',
            },
            tags: ['custom'],
          })}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          ✨ Add Custom Text
        </button>
      </div>
    </div>
  );
}
