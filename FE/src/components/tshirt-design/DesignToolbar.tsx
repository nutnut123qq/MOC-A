'use client';

import { useState, useRef } from 'react';
import { TShirtDesignSession, DesignLayer, TextTemplate } from '@/types/tshirt-design';
import FontSelector from './FontSelector';
import TextStylePanel from './TextStylePanel';
import TextTemplates from './TextTemplates';
import Icon from '@/components/ui/Icon';

interface DesignToolbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
  tshirt: any; // Add tshirt prop to access print area bounds
}

export default function DesignToolbar({
  collapsed,
  onToggleCollapse,
  designSession,
  onSessionUpdate,
  tshirt
}: DesignToolbarProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'stickers' | 'shapes' | 'layers'>('upload');
  const [textSubTab, setTextSubTab] = useState<'templates' | 'fonts' | 'style'>('templates');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get center position of current print area
  const getCenterPosition = (elementWidth: number, elementHeight: number) => {
    const currentPrintArea = tshirt?.printAreas?.find((pa: any) => pa.name === designSession.currentPrintArea);
    if (!currentPrintArea) {
      return { x: 50, y: 50 }; // fallback
    }

    const centerX = currentPrintArea.bounds.x + (currentPrintArea.bounds.width - elementWidth) / 2;
    const centerY = currentPrintArea.bounds.y + (currentPrintArea.bounds.height - elementHeight) / 2;

    return { x: centerX, y: centerY };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageWidth = 100;
      const imageHeight = 100;
      const centerPos = getCenterPosition(imageWidth, imageHeight);

      const newLayer: DesignLayer = {
        id: `image-${Date.now()}`,
        type: 'image',
        content: event.target?.result as string,
        position: centerPos,
        transform: { rotation: 0, scaleX: 1, scaleY: 1 },
        printArea: designSession.currentPrintArea,
        style: { width: imageWidth, height: imageHeight },
        visible: true,
        locked: false,
      };

      const updatedLayers = [...designSession.designLayers, newLayer];
      onSessionUpdate({
        ...designSession,
        designLayers: updatedLayers,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    const textWidth = 150;
    const textHeight = 40;
    const centerPos = getCenterPosition(textWidth, textHeight);

    const newLayer: DesignLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Text Của Bạn',
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        width: textWidth,
        height: textHeight,
        fontSize: 24,
        fontFamily: 'Pacifico',
        color: '#FF69B4',
        fontWeight: '400',
        textAlign: 'center',
      },
      visible: true,
      locked: false,
    };

    const updatedLayers = [...designSession.designLayers, newLayer];
    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
    setSelectedLayerId(newLayer.id);
  };

  const handleTemplateSelect = (template: TextTemplate) => {
    const textWidth = 200;
    const textHeight = 60;
    const centerPos = getCenterPosition(textWidth, textHeight);

    const newLayer: DesignLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: template.previewText,
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        ...template.style,
        width: textWidth,
        height: textHeight,
      },
      visible: true,
      locked: false,
    };

    const updatedLayers = [...designSession.designLayers, newLayer];
    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
    setSelectedLayerId(newLayer.id);
    setTextSubTab('style');
  };

  const handleFontChange = (fontFamily: string) => {
    if (!selectedLayerId) return;

    const updatedLayers = designSession.designLayers.map(layer =>
      layer.id === selectedLayerId
        ? { ...layer, style: { ...layer.style, fontFamily } }
        : layer
    );

    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
  };

  const handleStyleChange = (newStyle: any) => {
    if (!selectedLayerId) return;

    const updatedLayers = designSession.designLayers.map(layer =>
      layer.id === selectedLayerId
        ? { ...layer, style: { ...layer.style, ...newStyle } }
        : layer
    );

    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
  };

  const handleTextChange = (newText: string) => {
    if (!selectedLayerId) return;

    const updatedLayers = designSession.designLayers.map(layer =>
      layer.id === selectedLayerId
        ? { ...layer, content: newText }
        : layer
    );

    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
  };

  const handleAddSticker = (sticker: string) => {
    const stickerWidth = 60;
    const stickerHeight = 60;
    const centerPos = getCenterPosition(stickerWidth, stickerHeight);

    const newLayer: DesignLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      content: sticker,
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        width: stickerWidth,
        height: stickerHeight,
        fontSize: 48
      },
      visible: true,
      locked: false,
    };

    const updatedLayers = [...designSession.designLayers, newLayer];
    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
  };

  const handleAddShape = (shapeType: string) => {
    const shapeWidth = 80;
    const shapeHeight = 80;
    const centerPos = getCenterPosition(shapeWidth, shapeHeight);

    const newLayer: DesignLayer = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      content: shapeType,
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        width: shapeWidth,
        height: shapeHeight,
        backgroundColor: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 2,
      },
      visible: true,
      locked: false,
    };

    const updatedLayers = [...designSession.designLayers, newLayer];
    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });
  };

  const currentPrintAreaLayers = designSession.designLayers.filter(
    layer => layer.printArea === designSession.currentPrintArea
  );

  const selectedLayer = selectedLayerId
    ? designSession.designLayers.find(layer => layer.id === selectedLayerId)
    : null;

  const stickers = ['⭐', '❤️', '🎉', '🔥', '💎', '🌟', '🎨', '🚀', '💫', '🎯', '🌈', '⚡'];
  const shapes = ['rectangle', 'circle', 'triangle', 'star'];

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Design Tools</h3>
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'upload', label: 'Upload', icon: 'upload' },
            { id: 'text', label: 'Text', icon: 'type' },
            { id: 'stickers', label: 'Stickers', icon: 'stickers' },
            { id: 'shapes', label: 'Shapes', icon: 'shapes' },
            { id: 'layers', label: 'Layers', icon: 'layers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="mb-2 flex justify-center">
                <Icon name="upload" size={32} className="text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-700">Upload Image</div>
              <div className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 10MB</div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* Text Sub-tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'templates', label: 'Mẫu', icon: 'palette' },
                { id: 'fonts', label: 'Font', icon: 'type' },
                { id: 'style', label: 'Kiểu', icon: 'edit' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTextSubTab(tab.id as any)}
                  className={`flex-1 px-2 py-2 text-xs font-medium border-b-2 transition-colors ${
                    textSubTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon name={tab.icon} size={14} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Text Sub-content */}
            {textSubTab === 'templates' && (
              <TextTemplates onTemplateSelect={handleTemplateSelect} />
            )}

            {textSubTab === 'fonts' && (
              <div className="space-y-4">
                <button
                  onClick={handleAddText}
                  className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  ➕ Thêm Text Mới
                </button>
                <FontSelector
                  selectedFont={selectedLayer?.style?.fontFamily || 'Pacifico'}
                  onFontChange={handleFontChange}
                  previewText={selectedLayer?.content || 'Text Mẫu'}
                />
                {!selectedLayerId && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Chọn một lớp text để thay đổi font
                  </div>
                )}
              </div>
            )}

            {textSubTab === 'style' && (
              <div className="space-y-4">
                {!selectedLayerId && (
                  <button
                    onClick={handleAddText}
                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    ➕ Thêm Text Mới
                  </button>
                )}
                {selectedLayer && selectedLayer.type === 'text' ? (
                  <TextStylePanel
                    style={selectedLayer.style || {}}
                    onStyleChange={handleStyleChange}
                    text={selectedLayer.content || ''}
                    onTextChange={handleTextChange}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <div className="text-2xl mb-2">📝</div>
                    <div>Chọn một lớp text để chỉnh sửa kiểu</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stickers' && (
          <div className="grid grid-cols-4 gap-2">
            {stickers.map((sticker, index) => (
              <button
                key={index}
                onClick={() => handleAddSticker(sticker)}
                className="aspect-square flex items-center justify-center text-2xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sticker}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'shapes' && (
          <div className="space-y-2">
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => handleAddShape(shape)}
                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors capitalize"
              >
                {shape}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-3">
              {designSession.currentPrintArea === 'front' ? 'Front' : 'Back'} Layers ({currentPrintAreaLayers.length})
            </div>
            {currentPrintAreaLayers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No layers yet. Add some content!
              </div>
            ) : (
              currentPrintAreaLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="flex-1 text-sm truncate">
                    {layer.type === 'text' ? layer.content : `${layer.type}-${layer.id.split('-')[1]}`}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        selectedLayerId === layer.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        const updatedLayers = designSession.designLayers.map(l =>
                          l.id === layer.id ? { ...l, visible: !l.visible } : l
                        );
                        onSessionUpdate({
                          ...designSession,
                          designLayers: updatedLayers,
                        });
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {layer.visible ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
