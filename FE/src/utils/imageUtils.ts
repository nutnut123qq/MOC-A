/**
 * Utility functions for handling design images
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get image source URL from design layer content
 * Supports both file paths and base64 data
 */
export function getImageSource(layerContent: any): string | null {
  if (!layerContent) {
    return null;
  }

  // Handle loading state
  if (layerContent.loading) {
    return null; // Return null for loading state, component can show placeholder
  }

  // Handle temp file path data (temporary storage)
  if (typeof layerContent === 'object' && layerContent.type === 'temp' && layerContent.tempPath) {
    const url = `${API_BASE_URL}${layerContent.tempPath}`;
    console.log('🔍 getImageSource: Temp file path:', url);
    return url;
  }

  // Handle file path data (permanent storage)
  if (typeof layerContent === 'object' && layerContent.type === 'file' && layerContent.filePath) {
    const url = `${API_BASE_URL}${layerContent.filePath}`;
    console.log('🔍 getImageSource: File path (permanent):', url);
    return url;
  }

  // Handle legacy file path data
  if (typeof layerContent === 'object' && layerContent.filePath) {
    const url = `${API_BASE_URL}${layerContent.filePath}`;
    console.log('🔍 getImageSource: File path (legacy):', url);
    return url;
  }

  // Handle direct file path string
  if (typeof layerContent === 'string' && layerContent.startsWith('/uploads/')) {
    const url = `${API_BASE_URL}${layerContent}`;
    console.log('🔍 getImageSource: Direct file path:', url);
    return url;
  }

  // Handle base64 data (legacy system)
  if (typeof layerContent === 'string' && layerContent.startsWith('data:image/')) {
    console.log('🔍 getImageSource: Base64 data');
    return layerContent;
  }

  // Handle compressed base64 data with src property
  if (typeof layerContent === 'object' && layerContent.src) {
    console.log('🔍 getImageSource: Base64 with src property');
    return layerContent.src;
  }

  // Handle direct base64 string (fallback)
  if (typeof layerContent === 'string' && layerContent.length > 100) {
    console.log('🔍 getImageSource: Direct base64 string (fallback)');
    return layerContent;
  }

  console.warn('❌ Unknown image content format:', layerContent);
  return null;
}

/**
 * Check if layer content is in loading state
 */
export function isImageLoading(layerContent: any): boolean {
  return layerContent && typeof layerContent === 'object' && layerContent.loading === true;
}

/**
 * Check if layer content uses file storage
 */
export function isFileStorageImage(layerContent: any): boolean {
  if (typeof layerContent === 'object' && layerContent.type === 'temp' && layerContent.tempPath) {
    return true;
  }
  if (typeof layerContent === 'object' && layerContent.type === 'file' && layerContent.filePath) {
    return true;
  }
  if (typeof layerContent === 'object' && layerContent.filePath) {
    return true;
  }
  if (typeof layerContent === 'string' && layerContent.startsWith('/uploads/')) {
    return true;
  }
  if (typeof layerContent === 'string' && layerContent.startsWith('/temp/')) {
    return true;
  }
  return false;
}

/**
 * Check if layer content is base64 data
 */
export function isBase64Image(layerContent: any): boolean {
  if (typeof layerContent === 'string' && layerContent.startsWith('data:image/')) {
    return true;
  }
  if (typeof layerContent === 'object' && layerContent.src && layerContent.src.startsWith('data:image/')) {
    return true;
  }
  return false;
}

/**
 * Get file info from layer content
 */
export function getImageInfo(layerContent: any): { type: 'file' | 'base64' | 'loading' | 'unknown', size?: number } {
  if (isImageLoading(layerContent)) {
    return { type: 'loading' };
  }

  if (isFileStorageImage(layerContent)) {
    return { type: 'file' };
  }

  if (isBase64Image(layerContent)) {
    const base64String = typeof layerContent === 'string' ? layerContent : layerContent.src;
    const size = base64String ? Math.round(base64String.length * 0.75) : undefined; // Approximate size
    return { type: 'base64', size };
  }

  return { type: 'unknown' };
}

/**
 * Create placeholder image URL for loading state
 */
export function getPlaceholderImageUrl(width: number = 100, height: number = 100): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
        Loading...
      </text>
    </svg>
  `)}`;
}

/**
 * Create error placeholder image URL
 */
export function getErrorImageUrl(width: number = 100, height: number = 100): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fef2f2"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#ef4444" font-family="Arial, sans-serif" font-size="12">
        Error
      </text>
    </svg>
  `)}`;
}
