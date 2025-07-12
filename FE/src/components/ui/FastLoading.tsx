'use client';

import React from 'react';

interface FastLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  minimal?: boolean;
}

// Optimized loading component with minimal DOM elements
export default function FastLoading({ 
  size = 'md', 
  text,
  className = '',
  minimal = false
}: FastLoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  // Minimal version for fastest rendering
  if (minimal) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`animate-spin rounded-full border-2 border-amber-600 border-t-transparent ${sizeClasses[size]}`} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-amber-600 border-t-transparent ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-3 text-gray-600 text-sm">
          {text}
        </p>
      )}
    </div>
  );
}

// Page loading wrapper with optimized rendering
export function PageLoading({ children, loading, fallback }: {
  children: React.ReactNode;
  loading: boolean;
  fallback?: React.ReactNode;
}) {
  if (loading) {
    return fallback || <FastLoading minimal className="min-h-[200px]" />;
  }

  return <>{children}</>;
}

// Skeleton components for better perceived performance
export function FastSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <FastSkeleton className="h-48 w-full mb-4" />
      <FastSkeleton className="h-4 w-3/4 mb-2" />
      <FastSkeleton className="h-4 w-1/2" />
    </div>
  );
}
