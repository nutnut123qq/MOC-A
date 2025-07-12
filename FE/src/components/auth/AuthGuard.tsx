'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import FastLoading from '@/components/ui/FastLoading';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure user is not authenticated
    // Don't wait for full loading if we have no token at all
    if (!isLoading && !isAuthenticated && !token) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, token, router]);

  // Show loading only for a brief moment
  if (isLoading && !token) {
    return <FastLoading minimal className="min-h-screen" />;
  }

  // If we have a token, show content immediately even if user data is still loading
  if (token || isAuthenticated) {
    return <>{children}</>;
  }

  // Only show redirect message if we're sure user is not authenticated
  if (!isAuthenticated && !token) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang chuyển hướng...
          </h2>
          <p className="text-gray-600">
            Bạn cần đăng nhập để truy cập trang này
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
