import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5168';

class AuthAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      console.log('Making API request to:', url);
      console.log('Request config:', config);

      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error(`Failed to parse response: ${text}`);
      }

      if (!response.ok) {
        console.error('Validation errors:', data.errors);
        const errorMessage = data.errors ?
          Object.entries(data.errors).map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`).join('; ') :
          data.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      console.error('URL:', url);
      console.error('Config:', config);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('Register userData:', userData);
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    return this.request('/api/auth/me', {
      method: 'GET',
    });
  }

  async forgotPassword(email: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(email),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const authAPI = new AuthAPI();
