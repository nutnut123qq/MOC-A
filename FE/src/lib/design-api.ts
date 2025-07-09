import { authAPI } from './auth-api';
import { TShirtDesignSession, DesignLayer } from '@/types/tshirt-design';

// Types for Design API
export interface CreateDesignRequest {
  name: string;
  description?: string;
  productId: number;
  designSession: TShirtDesignSession;
}

export interface UpdateDesignRequest {
  name: string;
  description?: string;
  designSession: TShirtDesignSession;
}

export interface Design {
  id: number;
  name: string;
  description?: string;
  productId: number;
  productName: string;
  previewImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  designSession?: TShirtDesignSession;
}



export interface CloneDesignRequest {
  newName: string;
}

class DesignAPI {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5168';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Token from localStorage:', token ? 'Present' : 'Missing');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Design API request error:', {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        errorData
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Don't redirect immediately, let the component handle it
        throw new Error('Authentication required');
      }

      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    // For DELETE requests, don't try to parse JSON if response is empty
    if (options.method === 'DELETE' && response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data;
  }

  // Get all designs for current user
  async getMyDesigns(): Promise<Design[]> {
    return this.request<Design[]>('/api/designs');
  }

  // Get specific design by ID
  async getDesignById(id: number): Promise<Design> {
    return this.request<Design>(`/api/designs/${id}`);
  }

  // Create new design
  async createDesign(designData: CreateDesignRequest): Promise<Design> {
    console.log('🚀 Creating design with data:', designData);
    return this.request<Design>('/api/designs', {
      method: 'POST',
      body: JSON.stringify(designData),
    });
  }

  // Update existing design
  async updateDesign(id: number, designData: UpdateDesignRequest): Promise<Design> {
    return this.request<Design>(`/api/designs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(designData),
    });
  }

  // Delete design
  async deleteDesign(id: number, userId: number): Promise<void> {
    return this.request<void>(`/api/designs/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // Clone design
  async cloneDesign(id: number, newName: string): Promise<Design> {
    return this.request<Design>(`/api/designs/${id}/clone`, {
      method: 'POST',
      body: JSON.stringify({ newName }),
    });
  }

  // Upload image file to temporary storage
  async uploadTempImageFile(layerId: string, file: File): Promise<TempUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('layerId', layerId);

    return this.request<TempUploadResponse>('/api/TempFiles/upload-image', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // Upload image file and get file path (permanent storage)
  async uploadImageFile(designId: number, layerId: string, file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('designId', designId.toString());
    formData.append('layerId', layerId);

    return this.request<UploadImageResponse>('/api/design-files/upload-image', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // Upload base64 image and get file path
  async uploadBase64Image(designId: number, layerId: string, base64Data: string, fileName?: string): Promise<UploadImageResponse> {
    return this.request<UploadImageResponse>('/api/design-files/upload-base64', {
      method: 'POST',
      body: JSON.stringify({
        designId,
        layerId,
        base64Data,
        fileName: fileName || 'image.jpg'
      }),
    });
  }

  // Delete design file
  async deleteDesignFile(fileId: number): Promise<void> {
    return this.request<void>(`/api/design-files/${fileId}`, {
      method: 'DELETE',
    });
  }
}

// Response types for file upload
export interface UploadImageResponse {
  filePath: string;
  fileUrl: string;
  fileId: number;
}

export interface TempUploadResponse {
  tempPath: string;
  fileName: string;
  fileSize: number;
  sessionId: string;
  layerId: string;
}

export const designAPI = new DesignAPI();
