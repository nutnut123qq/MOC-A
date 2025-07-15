'use client';

import { useState, useRef } from 'react';
import { TShirtDesignSession, DesignLayer, TextTemplate } from '@/types/tshirt-design';
import FontSelector from './FontSelector';
import TextStylePanel from './TextStylePanel';
import TextTemplates from './TextTemplates';
import Icon from '@/components/ui/Icon';
import { designAPI } from '@/lib/design-api';

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

  const compressImage = (file: File, maxSizeKB: number = 500): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions to keep aspect ratio
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels until size is acceptable
        let quality = 0.8;
        let compressedData = canvas.toDataURL('image/jpeg', quality);

        while (compressedData.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressedData = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedData);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
      return;
    }

    try {
      const imageWidth = 100;
      const imageHeight = 100;
      const centerPos = getCenterPosition(imageWidth, imageHeight);
      const layerId = `image-${Date.now()}`;

      // Create temporary layer with loading state
      const tempLayer: DesignLayer = {
        id: layerId,
        type: 'image',
        content: { loading: true, originalFile: file.name },
        position: centerPos,
        transform: { rotation: 0, scaleX: 1, scaleY: 1 },
        printArea: designSession.currentPrintArea,
        style: { width: imageWidth, height: imageHeight },
        visible: true,
        locked: false,
      };

      // Add temporary layer to show loading state
      const tempLayers = [...designSession.designLayers, tempLayer];
      console.log('🔄 Adding temp layer. Before:', designSession.designLayers.length, 'After:', tempLayers.length);

      onSessionUpdate({
        ...designSession,
        designLayers: tempLayers,
      });

      console.log('📤 Uploading image to temp storage...', {
        fileName: file.name,
        fileSize: file.size,
        fileSizeKB: Math.round(file.size / 1024),
        layerId: layerId
      });

      // Upload file to temporary storage
      const uploadResponse = await designAPI.uploadTempImageFile(layerId, file);

      console.log('✅ Image uploaded to temp storage:', uploadResponse);

      // Update layer with temp file path
      const finalLayer: DesignLayer = {
        ...tempLayer,
        content: {
          type: 'temp',
          tempPath: uploadResponse.tempPath,
          sessionId: uploadResponse.sessionId,
          originalFile: file.name,
          fileSize: uploadResponse.fileSize
        }
      };

      console.log('🔄 Updating layer:', layerId, 'with content:', finalLayer.content);

      // Get current layers (might include the temp layer we just added)
      const currentLayers = designSession.designLayers;
      console.log('📋 Current layers before update:', currentLayers.map(l => ({ id: l.id, content: l.content })));

      // Find and update the layer, or add it if not found
      const existingLayerIndex = currentLayers.findIndex(layer => layer.id === layerId);
      let updatedLayers;

      if (existingLayerIndex >= 0) {
        // Update existing layer
        updatedLayers = currentLayers.map(layer =>
          layer.id === layerId ? finalLayer : layer
        );
        console.log('📝 Updated existing layer at index:', existingLayerIndex);
      } else {
        // Add new layer if not found
        updatedLayers = [...currentLayers, finalLayer];
        console.log('➕ Added new layer (not found in current layers)');
      }

      console.log('📋 Updated layers:', updatedLayers.map(l => ({ id: l.id, content: l.content })));

      onSessionUpdate({
        ...designSession,
        designLayers: updatedLayers,
      });

    } catch (error) {
      console.error('❌ Error uploading image:', error);
      alert('Không thể tải ảnh lên. Vui lòng thử lại.');

      // Remove failed layer
      const cleanedLayers = designSession.designLayers.filter(layer =>
        layer.id !== layerId
      );
      onSessionUpdate({
        ...designSession,
        designLayers: cleanedLayers,
      });
    }
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

  const handleAddSticker = (sticker: { emoji: string; svg: React.ReactNode }) => {
    const stickerWidth = 60;
    const stickerHeight = 60;
    const centerPos = getCenterPosition(stickerWidth, stickerHeight);

    const newLayer: DesignLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      content: sticker.emoji,
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

  const stickers = [
    { emoji: '⭐', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> },
    { emoji: '❤️', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> },
    { emoji: '🎉', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg> },
    { emoji: '🔥', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg> },
    { emoji: '💎', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg> },
    { emoji: '🌟', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> },
    { emoji: '🎨', svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
    { emoji: '🚀', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg> },
    { emoji: '💫', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg> },
    { emoji: '🎯', svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { emoji: '🌈', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg> },
    { emoji: '⚡', svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg> }
  ];
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
            { id: 'upload', label: 'Tải Lên', icon: 'upload' },
            { id: 'text', label: 'Chữ', icon: 'type' },
            { id: 'stickers', label: 'Sticker', icon: 'stickers' },
            { id: 'shapes', label: 'Hình', icon: 'shapes' },
            { id: 'layers', label: 'Lớp', icon: 'layers' },
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
              <div className="text-sm font-medium text-gray-700">Tải Lên Hình Ảnh</div>
              <div className="text-xs text-gray-500 mt-1">PNG, JPG, SVG tối đa 10MB</div>
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
                    <div className="mb-2 flex justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
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
                className="aspect-square flex items-center justify-center p-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                title={sticker.emoji}
              >
                {sticker.svg}
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
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
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
                      {layer.visible ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
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
