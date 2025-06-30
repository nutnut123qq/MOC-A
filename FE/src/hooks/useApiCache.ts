'use client';

import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const apiCache = new ApiCache();

interface UseApiCacheOptions {
  ttl?: number;
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export function useApiCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseApiCacheOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    refetchOnMount = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (!forceRefresh && apiCache.has(key)) {
        const cachedData = apiCache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // Fetch fresh data
      const freshData = await fetcher();
      
      // Cache the result
      apiCache.set(key, freshData, ttl);
      setData(freshData);
      
      return freshData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error(`API Cache Error for key "${key}":`, err);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, enabled]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    apiCache.delete(key);
  }, [key]);

  useEffect(() => {
    if (enabled) {
      // Check if we should refetch on mount
      if (refetchOnMount || !apiCache.has(key)) {
        fetchData();
      } else {
        // Use cached data immediately
        const cachedData = apiCache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
        } else {
          fetchData();
        }
      }
    }
  }, [key, enabled, refetchOnMount, fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
    isFromCache: apiCache.has(key),
  };
}

export { apiCache };
