import { TShirtDesignSession } from '@/types/tshirt-design';
import { getTShirtImagePath } from '@/data/tshirt-options';
import { getPrintAreaBounds } from '@/utils/printAreaCalculator';

/**
 * Generate preview image URL từ design session
 * Sử dụng HTML5 Canvas để render design và convert thành base64 image
 */
export class DesignPreviewGenerator {
  private static canvas: HTMLCanvasElement | null = null;
  private static ctx: CanvasRenderingContext2D | null = null;

  /**
   * Initialize canvas cho việc render preview
   */
  private static initCanvas(width: number = 400, height: number = 500): void {
    if (typeof window === 'undefined') return; // Server-side check

    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
    
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Load image từ URL và return Promise<HTMLImageElement>
   */
  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Để tránh CORS issues
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Generate preview image từ design session
   */
  static async generatePreviewImage(
    designSession: TShirtDesignSession,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'png' | 'jpeg';
    } = {}
  ): Promise<string | null> {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      const { width = 400, height = 500, quality = 0.8, format = 'png' } = options;
      
      this.initCanvas(width, height);
      if (!this.canvas || !this.ctx) return null;

      // Clear canvas
      this.ctx.clearRect(0, 0, width, height);

      // Lấy T-shirt image
      const view = designSession.currentPrintArea === 'back' ? 'back' : 'front';
      const tshirtImagePath = getTShirtImagePath(
        designSession.selectedSize,
        designSession.selectedColor,
        view
      );

      // Load và draw T-shirt background
      const tshirtImg = await this.loadImage(tshirtImagePath);
      this.ctx.drawImage(tshirtImg, 0, 0, width, height);

      // Lấy print area bounds
      const currentView = designSession.currentPrintArea || 'front';
      const currentSize = designSession.selectedSize || 'M';
      const printAreaBounds = getPrintAreaBounds(currentSize, currentView);

      // Filter layers cho current print area
      const currentLayers = designSession.designLayers.filter(
        layer => layer.printArea === designSession.currentPrintArea
      );

      // Render từng layer
      for (const layer of currentLayers) {
        await this.renderLayer(layer, printAreaBounds);
      }

      // Convert canvas to base64
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      return this.canvas.toDataURL(mimeType, quality);

    } catch (error) {
      console.error('Error generating preview image:', error);
      return null;
    }
  }

  /**
   * Render một layer lên canvas
   */
  private static async renderLayer(
    layer: any,
    printAreaBounds: { x: number; y: number; width: number; height: number }
  ): Promise<void> {
    if (!this.ctx || !this.canvas) return;

    // Save context state
    this.ctx.save();

    // Set clipping area to print area
    this.ctx.beginPath();
    this.ctx.rect(printAreaBounds.x, printAreaBounds.y, printAreaBounds.width, printAreaBounds.height);
    this.ctx.clip();

    // Calculate layer position relative to print area
    const layerX = layer.position.x;
    const layerY = layer.position.y;

    // Apply transforms
    this.ctx.translate(layerX, layerY);
    
    if (layer.transform?.rotation) {
      this.ctx.rotate((layer.transform.rotation * Math.PI) / 180);
    }
    
    if (layer.transform?.scaleX || layer.transform?.scaleY) {
      this.ctx.scale(
        layer.transform.scaleX || 1,
        layer.transform.scaleY || 1
      );
    }

    // Render based on layer type
    switch (layer.type) {
      case 'text':
        await this.renderTextLayer(layer);
        break;
      case 'image':
        await this.renderImageLayer(layer);
        break;
      case 'shape':
        await this.renderShapeLayer(layer);
        break;
    }

    // Restore context state
    this.ctx.restore();
  }

  /**
   * Render text layer
   */
  private static async renderTextLayer(layer: any): Promise<void> {
    if (!this.ctx) return;

    const style = layer.style || {};
    
    // Set text styles
    this.ctx.font = `${style.fontWeight || 'normal'} ${style.fontSize || 16}px ${style.fontFamily || 'Arial'}`;
    this.ctx.fillStyle = style.color || '#000000';
    this.ctx.textAlign = style.textAlign || 'left';
    this.ctx.textBaseline = 'top';

    if (style.opacity !== undefined) {
      this.ctx.globalAlpha = style.opacity;
    }

    // Draw text
    const text = layer.content || '';
    const lines = text.split('\n');
    const lineHeight = (style.fontSize || 16) * 1.2;

    lines.forEach((line: string, index: number) => {
      this.ctx!.fillText(line, 0, index * lineHeight);
    });
  }

  /**
   * Render image layer
   */
  private static async renderImageLayer(layer: any): Promise<void> {
    if (!this.ctx) return;

    try {
      const img = await this.loadImage(layer.content);
      const width = layer.style?.width || img.width;
      const height = layer.style?.height || img.height;
      
      if (layer.style?.opacity !== undefined) {
        this.ctx.globalAlpha = layer.style.opacity;
      }

      this.ctx.drawImage(img, 0, 0, width, height);
    } catch (error) {
      console.error('Error rendering image layer:', error);
    }
  }

  /**
   * Render shape layer
   */
  private static async renderShapeLayer(layer: any): Promise<void> {
    if (!this.ctx) return;

    const style = layer.style || {};
    const width = style.width || 50;
    const height = style.height || 50;

    this.ctx.fillStyle = style.backgroundColor || '#000000';
    
    if (style.opacity !== undefined) {
      this.ctx.globalAlpha = style.opacity;
    }

    switch (layer.content) {
      case 'rectangle':
        this.ctx.fillRect(0, 0, width, height);
        break;
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
        this.ctx.fill();
        break;
      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(width / 2, 0);
        this.ctx.lineTo(0, height);
        this.ctx.lineTo(width, height);
        this.ctx.closePath();
        this.ctx.fill();
        break;
    }
  }

  /**
   * Generate thumbnail preview (smaller size for cart)
   */
  static async generateThumbnail(
    designSession: TShirtDesignSession,
    size: number = 80
  ): Promise<string | null> {
    return this.generatePreviewImage(designSession, {
      width: size,
      height: Math.round(size * 1.25), // Maintain aspect ratio
      quality: 0.7,
      format: 'jpeg'
    });
  }
}
