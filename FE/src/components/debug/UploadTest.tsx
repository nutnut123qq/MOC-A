'use client';

import { useState, useRef } from 'react';
import { designAPI } from '@/lib/design-api';

interface UploadTestProps {
  onImageUploaded?: (filePath: string, fileUrl: string, fileId: number) => void;
}

export default function UploadTest({ onImageUploaded }: UploadTestProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      console.log('🚀 Testing file upload...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Test upload
      const result = await designAPI.uploadImageFile(
        1, // designId
        `test-layer-${Date.now()}`, // layerId
        file
      );

      console.log('✅ Upload successful:', result);
      setUploadResult(result);
      
      // Notify parent component
      onImageUploaded?.(result.filePath, result.fileUrl, result.fileId);

    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">🧪 Upload Test</h3>
      
      <div className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {uploading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>Uploading...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {uploadResult && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-semibold text-green-800 mb-2">✅ Upload Successful!</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div><strong>File Path:</strong> {uploadResult.filePath}</div>
              <div><strong>File URL:</strong> {uploadResult.fileUrl}</div>
              <div><strong>File ID:</strong> {uploadResult.fileId}</div>
            </div>
            
            {/* Preview uploaded image */}
            <div className="mt-3">
              <img 
                src={`http://localhost:5168${uploadResult.filePath}`}
                alt="Uploaded preview"
                className="max-w-32 max-h-32 object-cover border border-gray-300 rounded"
                onError={(e) => {
                  console.error('Failed to load uploaded image');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
