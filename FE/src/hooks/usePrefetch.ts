'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { apiCache } from './useApiCache';

export function usePrefetch() {
  const router = useRouter();

  // Prefetch common data
  const prefetchCommonData = useCallback(async () => {
    try {
      // Prefetch products if not already cached
      if (!apiCache.has('products')) {
        const products = await apiClient.getProducts();
        apiCache.set('products', products, 10 * 60 * 1000); // 10 minutes
      }

      // Prefetch users if not already cached
      if (!apiCache.has('users')) {
        const users = await apiClient.getUsers();
        apiCache.set('users', users, 5 * 60 * 1000); // 5 minutes
      }
    } catch (error) {
      // Prefetch failed silently
    }
  }, []);

  // Prefetch route
  const prefetchRoute = useCallback((href: string) => {
    router.prefetch(href);
  }, [router]);

  // Prefetch on hover
  const handleLinkHover = useCallback((href: string) => {
    prefetchRoute(href);
  }, [prefetchRoute]);

  // Auto prefetch common routes on mount
  useEffect(() => {
    // Prefetch common routes
    const commonRoutes = [
      '/design',
      '/users',
      '/cart'
    ];

    commonRoutes.forEach(route => {
      prefetchRoute(route);
    });

    // Prefetch data after a short delay
    const timer = setTimeout(prefetchCommonData, 1000);

    return () => clearTimeout(timer);
  }, [prefetchRoute, prefetchCommonData]);

  return {
    prefetchRoute,
    prefetchCommonData,
    handleLinkHover
  };
}

// Hook for specific page prefetching
export function usePagePrefetch(pageType: 'design' | 'users' | 'cart') {
  const { prefetchCommonData } = usePrefetch();

  useEffect(() => {
    // Prefetch data specific to this page type
    const prefetchPageData = async () => {
      switch (pageType) {
        case 'design':
          // Already handled by common prefetch
          break;
        case 'users':
          // Already handled by common prefetch
          break;
        case 'cart':
          // No specific API calls for cart page
          break;
      }
    };

    prefetchPageData();
  }, [pageType, prefetchCommonData]);
}
