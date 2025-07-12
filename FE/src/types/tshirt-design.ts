export type TShirtSizeType = 's' | 'm' | 'l' | 'xl' | 'xxl';
export type TShirtColorType = 'white' | 'black' | 'beige' | 'navi';

export interface TShirtSizeInfo {
  id: TShirtSizeType;
  name: string;
  displayName: string;
}

export interface TShirtColorInfo {
  id: TShirtColorType;
  name: string;
  displayName: string;
  hexCode: string;
}

export interface TShirtDesignSession {
  id: string;
  tshirtId: number;
  selectedColor: TShirtColorType;
  selectedSize: TShirtSizeType;
  designLayers: DesignLayer[];
  currentPrintArea: 'front' | 'back';
  createdAt: string;
  updatedAt: string;
  savedDesignId?: number; // ID của design đã lưu (nếu có)
}

export interface DesignLayer {
  id: string;
  type: 'image' | 'text' | 'sticker' | 'shape' | 'decal-frame';
  content: any;
  position: Position2D;
  transform: Transform;
  printArea: 'front' | 'back';
  style?: LayerStyle;
  locked?: boolean;
  visible?: boolean;
  // For decal-frame type
  decalSize?: {
    width: number;
    height: number;
    range: string;
  };
  // For images converted from decal frames
  decalConstraints?: {
    maxWidth: number;
    maxHeight: number;
    frameX: number;
    frameY: number;
  };
}

export interface Position2D {
  x: number;
  y: number;
}

export interface Transform {
  rotation: number;
  scaleX: number;
  scaleY: number;
  skewX?: number;
  skewY?: number;
}

export interface LayerStyle {
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
  // Extended text properties
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textStroke?: {
    width: number;
    color: string;
  };
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    direction?: number; // for linear gradient angle
  };
}

export interface TShirtVariant {
  id: string;
  color: string;
  colorName: string;
  colorHex: string;
  sizes: TShirtSize[];
  mockupUrls: {
    front: string;
    back: string;
  };
  available: boolean;
}

export interface TShirtSize {
  size: string;
  name: string;
  available: boolean;
  price?: number;
}

export interface PrintArea {
  id: string;
  name: 'front' | 'back';
  bounds: Rectangle;
  maxDimensions: Dimensions;
  guidelines: DesignGuidelines;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface DesignGuidelines {
  safeArea: Rectangle;
  bleedArea?: Rectangle;
  recommendedDPI: number;
  maxFileSize: number; // in MB
  allowedFormats: string[];
}

export interface TShirtDesignData {
  sessionId: string;
  tshirtId: number;
  designName: string;
  frontLayers: DesignLayer[];
  backLayers: DesignLayer[];
  selectedVariant: TShirtVariant;
  previewUrls: {
    front?: string;
    back?: string;
  };
}

export interface CreateTShirtDesignDto {
  name: string;
  tshirtId: number;
  designData: string; // JSON stringified TShirtDesignData
  previewImageUrl: string;
  frontDesignUrl?: string;
  backDesignUrl?: string;
  isPublic: boolean;
}

export interface UpdateTShirtDesignDto {
  name: string;
  designData: string;
  previewImageUrl: string;
  frontDesignUrl?: string;
  backDesignUrl?: string;
  isPublic: boolean;
}

// Tool types
export interface DesignTool {
  id: string;
  name: string;
  icon: string;
  type: 'upload' | 'text' | 'sticker' | 'shape' | 'layer';
  active: boolean;
}

export interface TextTool {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right';
}

export interface FontFamily {
  id: string;
  name: string;
  displayName: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace' | 'cute' | 'decorative';
  variants: FontVariant[];
  previewText?: string;
  googleFont?: boolean;
  isPremium?: boolean;
}

export interface FontVariant {
  weight: string;
  style: 'normal' | 'italic';
  displayName: string;
}

export interface TextTemplate {
  id: string;
  name: string;
  category: 'cute' | 'elegant' | 'bold' | 'playful' | 'minimal' | 'vintage';
  previewText: string;
  style: LayerStyle;
  tags: string[];
  isPremium?: boolean;
}

export interface TextCategory {
  id: string;
  name: string;
  icon: string;
  templates: TextTemplate[];
}

export interface StickerCategory {
  id: string;
  name: string;
  stickers: Sticker[];
}

export interface Sticker {
  id: string;
  name: string;
  url: string;
  category: string;
  tags: string[];
  isPremium: boolean;
}

export interface Shape {
  id: string;
  name: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart';
  defaultStyle: LayerStyle;
}

// Canvas types
export interface CanvasState {
  zoom: number;
  pan: Position2D;
  selectedLayerId: string | null;
  isDragging: boolean;
  isResizing: boolean;
  showGrid: boolean;
  showGuides: boolean;
}

export interface CanvasHistory {
  states: DesignLayer[][];
  currentIndex: number;
  maxStates: number;
}
