'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiCache } from './useApiCache';

interface UseOptimizedDataOptions<T> {
  cacheKey: string;
  cacheDuration?: number; // in milliseconds
  immediate?: boolean;
  dependencies?: any[];
}

interface UseOptimizedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Hook for optimized data fetching with caching and background loading
export function useOptimizedData<T>(
  fetchFn: () => Promise<T>,
  options: UseOptimizedDataOptions<T>
): UseOptimizedDataReturn<T> {
  const {
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    immediate = true,
    dependencies = []
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    const cachedData = apiCache.get<T>(cacheKey);
    if (cachedData) {
      setData(cachedData);
      setError(null);
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const result = await fetchFn();
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(result);
      apiCache.set(cacheKey, result, cacheDuration);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred');
        console.error(`Error fetching data for ${cacheKey}:`, err);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [fetchFn, cacheKey, cacheDuration]);

  const refetch = useCallback(async () => {
    apiCache.delete(cacheKey);
    await fetchData(true);
  }, [fetchData, cacheKey]);

  const clearCache = useCallback(() => {
    apiCache.delete(cacheKey);
  }, [cacheKey]);

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData(true);
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
}

// Hook for background data prefetching
export function useBackgroundPrefetch() {
  const prefetchedRef = useRef(new Set<string>());

  const prefetchData = useCallback(async <T>(
    fetchFn: () => Promise<T>,
    cacheKey: string,
    cacheDuration = 5 * 60 * 1000
  ) => {
    // Don't prefetch if already done
    if (prefetchedRef.current.has(cacheKey)) {
      return;
    }

    // Don't prefetch if already cached
    if (apiCache.has(cacheKey)) {
      prefetchedRef.current.add(cacheKey);
      return;
    }

    try {
      const result = await fetchFn();
      apiCache.set(cacheKey, result, cacheDuration);
      prefetchedRef.current.add(cacheKey);
    } catch (error) {
      // Silently fail for prefetch
      console.warn(`Prefetch failed for ${cacheKey}:`, error);
    }
  }, []);

  return { prefetchData };
}

// Hook for optimized list data with pagination
export function useOptimizedList<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  cacheKeyPrefix: string,
  pageSize = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (page: number) => {
    const cacheKey = `${cacheKeyPrefix}_page_${page}`;
    
    // Check cache first
    const cachedResult = apiCache.get<{ data: T[]; total: number }>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await fetchFn(page, pageSize);
    apiCache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes cache
    return result;
  }, [fetchFn, cacheKeyPrefix, pageSize]);

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await loadPage(page);
      
      if (page === 1) {
        setAllData(result.data);
      } else {
        setAllData(prev => [...prev, ...result.data]);
      }
      
      setTotal(result.total);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!loading && allData.length < total) {
      fetchData(currentPage + 1);
    }
  }, [loading, allData.length, total, currentPage, fetchData]);

  const refresh = useCallback(() => {
    // Clear cache for all pages
    for (let i = 1; i <= currentPage; i++) {
      apiCache.delete(`${cacheKeyPrefix}_page_${i}`);
    }
    setAllData([]);
    setCurrentPage(1);
    fetchData(1);
  }, [cacheKeyPrefix, currentPage, fetchData]);

  // Initial load
  useEffect(() => {
    fetchData(1);
  }, []);

  return {
    data: allData,
    total,
    loading,
    error,
    hasMore: allData.length < total,
    loadMore,
    refresh
  };
}
