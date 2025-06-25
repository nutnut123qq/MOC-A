export interface Design {
  id: number;
  userId: number;
  name: string;
  canvasData: string;
  previewImageUrl: string;
  width: number;
  height: number;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
  userName?: string;
}

export interface DesignListItem {
  id: number;
  name: string;
  previewImageUrl: string;
  width: number;
  height: number;
  viewCount: number;
  createdAt: string;
}

export interface CreateDesignDto {
  name: string;
  canvasData: string;
  previewImageUrl: string;
  width: number;
  height: number;
  isPublic: boolean;
}

export interface UpdateDesignDto {
  name: string;
  canvasData: string;
  previewImageUrl: string;
  width: number;
  height: number;
  isPublic: boolean;
}

export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'sticker' | 'drawing';
  content: string;
  position: {
    x: number;
    y: number;
  };
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    width?: number;
    height?: number;
    rotation?: number;
    opacity?: number;
  };
}

export interface CanvasData {
  elements: CanvasElement[];
  dimensions: {
    width: number;
    height: number;
  };
  backgroundColor?: string;
}
