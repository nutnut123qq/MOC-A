import { useState, useRef } from 'react';
import { TShirtDesignSession, DesignLayer, TextTemplate } from '@/types/tshirt-design';
import FontSelector from './FontSelector';
import TextStylePanel from './TextStylePanel';
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
  const [activeTab, setActiveTab] = useState<'text' | 'stickers' | 'shapes' | 'images'>('text');
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
    const printArea = designSession.printAreas.find(area => area.id === designSession.currentPrintArea);
    if (!printArea) return { x: 0, y: 0 };
    
    return {
      x: printArea.position.x + (printArea.size.width - width) / 2,
      y: printArea.position.y + (printArea.size.height - height) / 2
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

  const handleAddShape = (shape: string) => {
    const shapeWidth = 80;
    const shapeHeight = 80;
    const centerPos = getCenterPosition(shapeWidth, shapeHeight);

    const newLayer: DesignLayer = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      content: shape,
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        width: shapeWidth,
        height: shapeHeight,
        backgroundColor: '#3B82F6',
        borderRadius: shape === 'circle' ? '50%' : shape === 'rectangle' ? '0%' : '0%'
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

  const handleTemplateSelect = (template: TextTemplate) => {
    const textWidth = Math.max(200, template.text.length * template.fontSize * 0.6);
    const textHeight = template.fontSize * 1.2;
    const centerPos = getCenterPosition(textWidth, textHeight);

    const newLayer: DesignLayer = {
      id: `template-${Date.now()}`,
      type: 'text',
      content: template.text,
      position: centerPos,
      transform: { rotation: 0, scaleX: 1, scaleY: 1 },
      printArea: designSession.currentPrintArea,
      style: {
        fontFamily: template.fontFamily,
        fontSize: template.fontSize,
        color: template.color,
        textAlign: 'center',
        fontWeight: template.fontWeight || 'normal',
        fontStyle: template.fontStyle || 'normal',
        textDecoration: template.textDecoration || 'none',
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

  const shapes = ['rectangle', 'circle', 'triangle', 'star'];

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
        {[
          { id: 'text', label: 'Văn bản', icon: 'type' },
          { id: 'stickers', label: 'Sticker', icon: 'smile' },
          { id: 'shapes', label: 'Hình dạng', icon: 'square' },
          { id: 'images', label: 'Hình ảnh', icon: 'image' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon name={tab.icon} className="w-4 h-4 mb-1" />
            {tab.label}
          </button>
        ))}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
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

            <TextStylePanel
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              textColor={textColor}
              onTextColorChange={setTextColor}
              textAlign={textAlign}
              onTextAlignChange={setTextAlign}
              fontWeight={fontWeight}
              onFontWeightChange={setFontWeight}
              fontStyle={fontStyle}
              onFontStyleChange={setFontStyle}
              textDecoration={textDecoration}
              onTextDecorationChange={setTextDecoration}
            />

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

        {activeTab === 'shapes' && (
          <div className="grid grid-cols-2 gap-3">
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => handleAddShape(shape)}
                className="aspect-square flex items-center justify-center p-4 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <div className={`w-8 h-8 bg-blue-500 group-hover:bg-blue-600 transition-colors ${
                  shape === 'circle' ? 'rounded-full' : 
                  shape === 'triangle' ? 'clip-path-triangle' : 
                  shape === 'star' ? 'clip-path-star' : 
                  'rounded-sm'
                }`} />
              </button>
            ))}
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
