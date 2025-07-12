'use client';

import React, { memo, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWallet } from '@/contexts/WalletContext';
import FastLoading from '@/components/ui/FastLoading';
import Header from '@/components/Header';

interface OptimizedLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

// Memoized header component to prevent unnecessary re-renders
const MemoizedHeader = memo(function MemoizedHeader() {
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { balance } = useWallet();

  // Only re-render when these specific values change
  const headerData = useMemo(() => ({
    user,
    isAuthenticated,
    cartCount,
    balance
  }), [user, isAuthenticated, cartCount, balance]);

  return <Header />;
});

// Optimized layout component
const OptimizedLayout = memo(function OptimizedLayout({
  children,
  showHeader = true,
  showFooter = false,
  className = ''
}: OptimizedLayoutProps) {
  const { isLoading } = useAuth();

  // Show minimal loading for very brief moments
  if (isLoading) {
    return <FastLoading minimal className="min-h-screen" />;
  }

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {showHeader && <MemoizedHeader />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && (
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600">
              © 2024 Mộc. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
});

export default OptimizedLayout;

// Page wrapper with optimized loading states
export const PageWrapper = memo(function PageWrapper({
  children,
  loading = false,
  error = null,
  className = ''
}: {
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  className?: string;
}) {
  if (error) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <FastLoading minimal className={`min-h-[400px] ${className}`} />;
  }

  return <div className={className}>{children}</div>;
});

// Optimized container for admin pages
export const AdminPageWrapper = memo(function AdminPageWrapper({
  children,
  title,
  loading = false,
  className = ''
}: {
  children: React.ReactNode;
  title?: string;
  loading?: boolean;
  className?: string;
}) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FastLoading minimal className="min-h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
});
