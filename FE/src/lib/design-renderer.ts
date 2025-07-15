// Design renderer utility for generating high-quality images for printing

export interface DesignLayer {
  id: string;
  type: string;
  content: string;
  position: { x: number; y: number };
  style?: any;
  visible: boolean;
}

export interface DesignSession {
  designLayers: DesignLayer[];
  currentPrintArea: string;
}

export class DesignRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(width: number = 400, height: number = 500) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = ctx;
  }

  async renderDesign(designSession: DesignSession): Promise<Blob> {
    // Clear canvas with white background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Filter layers for current print area and visible layers
    const visibleLayers = designSession.designLayers.filter(layer => 
      layer.visible && 
      (!layer.printArea || layer.printArea === designSession.currentPrintArea)
    );

    // Sort layers by z-index if available
    visibleLayers.sort((a, b) => (a.style?.zIndex || 0) - (b.style?.zIndex || 0));

    // Render each layer
    for (const layer of visibleLayers) {
      await this.renderLayer(layer);
    }

    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    });
  }

  private async renderLayer(layer: DesignLayer): Promise<void> {
    const { type, content, position, style } = layer;

    this.ctx.save();

    // Apply transformations
    if (style?.rotation) {
      this.ctx.translate(position.x, position.y);
      this.ctx.rotate((style.rotation * Math.PI) / 180);
      this.ctx.translate(-position.x, -position.y);
    }

    if (style?.scaleX || style?.scaleY) {
      this.ctx.scale(style.scaleX || 1, style.scaleY || 1);
    }

    switch (type) {
      case 'text':
        await this.renderText(content, position, style);
        break;
      case 'image':
        await this.renderImage(content, position, style);
        break;
      case 'sticker':
        await this.renderSticker(content, position, style);
        break;
      case 'decal-frame':
        await this.renderDecalFrame(position, style);
        break;
    }

    this.ctx.restore();
  }

  private async renderText(text: string, position: { x: number; y: number }, style: any = {}): Promise<void> {
    this.ctx.fillStyle = style.color || '#000000';
    this.ctx.strokeStyle = style.strokeColor || 'transparent';
    this.ctx.lineWidth = style.strokeWidth || 0;
    
    const fontSize = style.fontSize || 16;
    const fontFamily = style.fontFamily || 'Arial';
    const fontWeight = style.fontWeight || 'normal';
    const fontStyle = style.fontStyle || 'normal';
    
    this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = style.textAlign || 'center';
    this.ctx.textBaseline = style.textBaseline || 'middle';

    // Apply text shadow if specified
    if (style.shadowColor) {
      this.ctx.shadowColor = style.shadowColor;
      this.ctx.shadowBlur = style.shadowBlur || 2;
      this.ctx.shadowOffsetX = style.shadowOffsetX || 1;
      this.ctx.shadowOffsetY = style.shadowOffsetY || 1;
    }

    // Render stroke first, then fill
    if (style.strokeWidth > 0) {
      this.ctx.strokeText(text, position.x, position.y);
    }
    this.ctx.fillText(text, position.x, position.y);

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  private async renderImage(src: string, position: { x: number; y: number }, style: any = {}): Promise<void> {
    try {
      const img = await this.loadImage(src);
      
      const width = style.width || img.width;
      const height = style.height || img.height;
      const x = position.x - (width / 2); // Center the image
      const y = position.y - (height / 2);

      // Apply opacity if specified
      if (style.opacity !== undefined) {
        this.ctx.globalAlpha = style.opacity;
      }

      this.ctx.drawImage(img, x, y, width, height);

      // Reset opacity
      this.ctx.globalAlpha = 1;
    } catch (error) {
      console.warn('Could not load image:', src, error);
      // Draw placeholder rectangle
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.strokeStyle = '#ccc';
      this.ctx.lineWidth = 1;
      const width = style.width || 50;
      const height = style.height || 50;
      const x = position.x - (width / 2);
      const y = position.y - (height / 2);
      this.ctx.fillRect(x, y, width, height);
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  private async renderSticker(src: string, position: { x: number; y: number }, style: any = {}): Promise<void> {
    // Stickers are rendered similar to images but with different default sizing
    await this.renderImage(src, position, {
      width: style.width || 30,
      height: style.height || 30,
      ...style
    });
  }

  private async renderDecalFrame(position: { x: number; y: number }, style: any = {}): Promise<void> {
    // Render decal frame border (for reference, usually not printed)
    if (style.showFrame !== false) {
      this.ctx.strokeStyle = style.borderColor || '#ddd';
      this.ctx.lineWidth = style.borderWidth || 1;
      this.ctx.setLineDash(style.borderDash || [5, 5]);
      
      const width = style.width || 100;
      const height = style.height || 100;
      const x = position.x - (width / 2);
      const y = position.y - (height / 2);
      
      this.ctx.strokeRect(x, y, width, height);
      this.ctx.setLineDash([]); // Reset line dash
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  downloadAsFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getDataURL(type: string = 'image/png', quality?: number): string {
    return this.canvas.toDataURL(type, quality);
  }
}

// Helper function to render and download design
export async function downloadDesignImage(
  designData: string, 
  filename: string,
  options: { width?: number; height?: number } = {}
): Promise<void> {
  try {
    const designSession: DesignSession = JSON.parse(designData);
    const renderer = new DesignRenderer(options.width, options.height);
    const blob = await renderer.renderDesign(designSession);
    renderer.downloadAsFile(blob, filename);
  } catch (error) {
    console.error('Error downloading design image:', error);
    throw new Error('Không thể tạo ảnh thiết kế');
  }
}
