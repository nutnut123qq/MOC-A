'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

function LoginPageContent() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if user is admin and redirect accordingly
      const returnUrl = searchParams.get('returnUrl');

      if (returnUrl) {
        // If there's a specific return URL, use it
        router.push(returnUrl);
      } else if (isAdmin) {
        // If user is admin and no specific return URL, go to admin dashboard
        router.push('/admin');
      } else {
        // Regular user goes to home page
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', paddingTop: '100px'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#E21C34'}}></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', paddingTop: '100px'}}>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
