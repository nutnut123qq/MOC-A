import { useState, useRef } from 'react';
import { TShirtDesignSession, DesignLayer, TextTemplate } from '@/types/tshirt-design';
import FontSelector from './FontSelector';
import TextTemplates from './TextTemplates';
import Icon from '@/components/ui/Icon';
import { stickerData } from '../../data/stickers';

interface DesignToolbarProps {
  designSession: TShirtDesignSession;
  onSessionUpdate: (session: TShirtDesignSession) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedLayer: DesignLayer | null;
  onLayerSelect: (layer: DesignLayer | null) => void;
}

export default function DesignToolbar({
  designSession,
  onSessionUpdate,
  collapsed,
  onToggleCollapse,
  selectedLayer,
  onLayerSelect
}: DesignToolbarProps) {
  const [activeTab, setActiveTab] = useState<'images' | 'stickers' | 'text' | 'layers'>('images');
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCenterPosition = (width: number, height: number) => {
    // Default print area dimensions for T-shirt front/back
    const printAreaWidth = 280;
    const printAreaHeight = 350;
    const printAreaX = 50;
    const printAreaY = 80;

    return {
      x: printAreaX + (printAreaWidth - width) / 2,
      y: printAreaY + (printAreaHeight - height) / 2
    };
  };

  const handleAddText = () => {
    if (!textInput.trim()) return;

    const textWidth = Math.max(200, textInput.length * fontSize * 0.6);
    const textHeight = fontSize * 1.2;
    const centerPos = getCenterPosition(textWidth, textHeight);

    const newLayer: DesignLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: textInput,
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        fontFamily: selectedFont,
        fontSize: fontSize,
        color: textColor,
        textAlign: textAlign,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        textDecoration: textDecoration,
        width: textWidth,
        height: textHeight
      },
      visible: true,
      locked: false,
    };

    const updatedLayers = [...designSession.designLayers, newLayer];
    onSessionUpdate({
      ...designSession,
      designLayers: updatedLayers,
    });

    setTextInput('');
  };

  const handleAddSticker = (sticker: { name?: string; url?: string; emoji?: string; svg?: React.ReactNode }) => {
    const stickerWidth = 60;
    const stickerHeight = 60;
    const centerPos = getCenterPosition(stickerWidth, stickerHeight);

    const newLayer: DesignLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      content: sticker.url || sticker.emoji || '',
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        width: stickerWidth,
        height: stickerHeight,
        fontSize: sticker.url ? undefined : 48
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const imageWidth = 150;
      const imageHeight = 150;
      const centerPos = getCenterPosition(imageWidth, imageHeight);

      const newLayer: DesignLayer = {
        id: `image-${Date.now()}`,
        type: 'image',
        content: imageUrl,
        position: centerPos,
        transform: { rotation: 0, scaleX: 1, scaleY: 1 },
        printArea: designSession.currentPrintArea,
        style: {
          width: imageWidth,
          height: imageHeight
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
    reader.readAsDataURL(file);
  };



  const handleTemplateSelect = (template: TextTemplate) => {
    const templateFontSize = template.style.fontSize || 24;
    const textWidth = Math.max(200, template.previewText.length * templateFontSize * 0.6);
    const textHeight = templateFontSize * 1.2;
    const centerPos = getCenterPosition(textWidth, textHeight);

    const newLayer: DesignLayer = {
      id: `template-${Date.now()}`,
      type: 'text',
      content: template.previewText,
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        ...template.style,
        width: textWidth,
        height: textHeight
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

  const stickers = stickerData.map(sticker => ({
    name: sticker.name,
    url: sticker.url,
    preview: <img src={sticker.preview} alt={sticker.name} className="w-8 h-8" />
  }));



  if (collapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mở rộng toolbar"
        >
          <Icon name="chevron-right" className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Công cụ thiết kế</h2>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Thu gọn toolbar"
        >
          <Icon name="chevron-left" className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('images')}
          className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors ${
            activeTab === 'images'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Hình ảnh
        </button>

        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors ${
            activeTab === 'stickers'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5H9m0-5a1.5 1.5 0 011.5-1.5H12a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5H9.5M9 10v5" />
          </svg>
          Sticker
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors ${
            activeTab === 'text'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Văn bản
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors ${
            activeTab === 'layers'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Lớp
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập văn bản
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Nhập văn bản..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                />
                <button
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Thêm
                </button>
              </div>
            </div>

            <FontSelector
              selectedFont={selectedFont}
              onFontChange={setSelectedFont}
            />

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước chữ
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>12px</span>
                  <span>{fontSize}px</span>
                  <span>72px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu chữ
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Căn chỉnh
                </label>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => setTextAlign(align)}
                      className={`flex-1 p-2 rounded border transition-colors ${
                        textAlign === align
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name={`align-${align}`} className="w-4 h-4 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kiểu chữ
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`flex-1 p-2 rounded border transition-colors ${
                      fontWeight === 'bold'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon name="bold" className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`flex-1 p-2 rounded border transition-colors ${
                      fontStyle === 'italic'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon name="italic" className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
                    className={`flex-1 p-2 rounded border transition-colors ${
                      textDecoration === 'underline'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon name="underline" className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            <TextTemplates onTemplateSelect={handleTemplateSelect} />
          </div>
        )}

        {activeTab === 'stickers' && (
          <div className="grid grid-cols-4 gap-2">
            {stickers.map((sticker, index) => (
              <button
                key={index}
                onClick={() => handleAddSticker(sticker)}
                className="aspect-square flex items-center justify-center p-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                title={sticker.name}
              >
                {sticker.preview}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Danh sách lớp</h3>
              <span className="text-xs text-gray-500">{designSession.designLayers.length} lớp</span>
            </div>

            {designSession.designLayers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm">Chưa có lớp nào</p>
                <p className="text-xs mt-1">Thêm văn bản, sticker hoặc hình ảnh để tạo lớp</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {designSession.designLayers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`flex items-center gap-2 p-2 rounded border transition-colors cursor-pointer ${
                      selectedLayer?.id === layer.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => onLayerSelect(layer)}
                  >
                    <div className="flex-shrink-0">
                      {layer.type === 'text' && (
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                      {layer.type === 'sticker' && (
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5H9m0-5a1.5 1.5 0 011.5-1.5H12a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5H9.5M9 10v5" />
                        </svg>
                      )}
                      {layer.type === 'image' && (
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {layer.type === 'text' ? layer.content :
                         layer.type === 'sticker' ? 'Sticker' :
                         layer.type === 'image' ? 'Hình ảnh' : 'Layer'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {layer.type} • Lớp {designSession.designLayers.length - index}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedLayers = designSession.designLayers.map(l =>
                            l.id === layer.id ? { ...l, visible: !l.visible } : l
                          );
                          onSessionUpdate({
                            ...designSession,
                            designLayers: updatedLayers,
                          });
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title={layer.visible ? 'Ẩn lớp' : 'Hiện lớp'}
                      >
                        {layer.visible ? (
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedLayers = designSession.designLayers.filter(l => l.id !== layer.id);
                          onSessionUpdate({
                            ...designSession,
                            designLayers: updatedLayers,
                          });
                          if (selectedLayer?.id === layer.id) {
                            onLayerSelect(null);
                          }
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Xóa lớp"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex flex-col items-center gap-2"
            >
              <Icon name="upload" className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">Tải lên hình ảnh</span>
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
      </div>
    </div>
  );
}
