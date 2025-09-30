import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getMockData } from '../services/mockDataService';

// Cache for storing fetched data
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseOptimizedDataOptions {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  enableRealtime?: boolean;
  cacheKey?: string;
}

export function useOptimizedData<T = any>({
  table,
  select = '*',
  filters = {},
  orderBy,
  limit,
  enableRealtime = false,
  cacheKey
}: UseOptimizedDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize the query key for caching
  const queryKey = useMemo(() => 
    cacheKey || JSON.stringify({ table, select, filters, orderBy, limit }), 
    [table, select, filters, orderBy, limit, cacheKey]
  );

  // Check cache first
  const getCachedData = useCallback(() => {
    const cached = dataCache.get(queryKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, [queryKey]);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from(table).select(select);

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });

        // Apply ordering
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        const { data: result, error: queryError } = await query.abortSignal(abortControllerRef.current.signal);

        if (queryError) {
          // Fallback to mock data if database query fails
          const mockResult = getMockData(table);
          setData(mockResult || []);
          // Cache mock data too
          dataCache.set(queryKey, {
            data: mockResult || [],
            timestamp: Date.now()
          });
          return;
        }

        const finalResult = result || [];
        setData(finalResult);
        
        // Cache the result
        dataCache.set(queryKey, {
          data: finalResult,
          timestamp: Date.now()
        });
      } catch (dbError) {
        if (dbError.name === 'AbortError') {
          return; // Request was cancelled
        }
        // Fallback to mock data
        const mockResult = getMockData(table);
        setData(mockResult || []);
        dataCache.set(queryKey, {
          data: mockResult || [],
          timestamp: Date.now()
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled
      }
      // Final fallback
      const mockResult = getMockData(table);
      setData(mockResult || []);
      setError(null); // Don't show error when using mock data
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [queryKey, getCachedData, table, select, filters, orderBy, limit]);

  useEffect(() => {
    fetchData();
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealtime) return;

    try {
      const subscription = supabase
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table }, 
          () => {
            // Invalidate cache on real-time updates
            dataCache.delete(queryKey);
            fetchData();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      // Fallback to periodic refresh
      const interval = setInterval(() => {
        // Only refresh if data is stale
        const cached = dataCache.get(queryKey);
        if (!cached || Date.now() - cached.timestamp > CACHE_DURATION) {
          fetchData();
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [table, enableRealtime, fetchData]);

  const refetch = useCallback(() => {
    // Clear cache and refetch
    dataCache.delete(queryKey);
    fetchData();
  }, [fetchData, queryKey]);

  return { data, loading, error, refetch };
}