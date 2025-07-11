'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, RegisterRequest } from '@/types/auth';
import { authAPI } from '@/lib/auth-api';
import { TokenManager } from '@/utils/token-manager';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (TokenManager.hasValidToken()) {
        setToken(TokenManager.getAccessToken());
        await getCurrentUser();
      } else {
        // Try to refresh token if we have a refresh token
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            await refreshTokens();
          } catch (refreshError) {
            // Refresh token failed, clear tokens silently
            // This is normal when refresh token is expired
            TokenManager.clearTokens();
            setUser(null);
            setToken(null);
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      TokenManager.clearTokens();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      TokenManager.clearTokens();
      setUser(null);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password, rememberMe });
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, expiresIn, user: userData } = response.data;

        TokenManager.setTokens(accessToken, refreshToken, expiresIn);
        setToken(accessToken);
        setUser(userData);
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, expiresIn, user: newUser } = response.data;
        
        TokenManager.setTokens(accessToken, refreshToken, expiresIn);
        setUser(newUser);
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      setToken(null);
    }
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken(refreshToken);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken: newRefreshToken, expiresIn, user: userData } = response.data;

        TokenManager.setTokens(accessToken, newRefreshToken, expiresIn);
        setToken(accessToken);
        setUser(userData);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      TokenManager.clearTokens();
      setUser(null);
      setToken(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    refreshToken: refreshTokens,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
