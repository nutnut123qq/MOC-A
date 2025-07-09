/**
 * Test utility for file upload functionality
 */

import { designAPI } from '@/lib/design-api';

export async function testFileUpload() {
  try {
    console.log('🧪 Testing file upload functionality...');
    
    // Create a test base64 image (small red square)
    const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    // Test upload
    const response = await designAPI.uploadBase64Image(
      1, // designId
      'test-layer-123', // layerId
      testBase64,
      'test-image.png'
    );
    
    console.log('✅ File upload successful:', response);
    return response;
  } catch (error) {
    console.error('❌ File upload failed:', error);
    throw error;
  }
}

// Test function to create a sample image file
export function createTestImageFile(): File {
  // Create a small canvas with a red square
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d')!;
  
  // Draw red square
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 100, 100);
  
  // Convert to blob and then to file
  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob!], 'test-image.png', { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  }) as any;
}

export async function testFormDataUpload() {
  try {
    console.log('🧪 Testing FormData file upload...');
    
    // Create test file
    const testFile = createTestImageFile();
    
    // Test upload
    const response = await designAPI.uploadImageFile(
      1, // designId
      'test-layer-456', // layerId
      testFile
    );
    
    console.log('✅ FormData upload successful:', response);
    return response;
  } catch (error) {
    console.error('❌ FormData upload failed:', error);
    throw error;
  }
}
