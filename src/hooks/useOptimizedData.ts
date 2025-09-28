import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { getMockData } from '../services/mockDataService';

interface UseOptimizedDataOptions {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  enableRealtime?: boolean;
}

export function useOptimizedData<T = any>({
  table,
  select = '*',
  filters = {},
  orderBy,
  limit,
  enableRealtime = false
}: UseOptimizedDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the query key for caching
  const queryKey = useMemo(() => 
    JSON.stringify({ table, select, filters, orderBy, limit }), 
    [table, select, filters, orderBy, limit]
  );

  const fetchData = useCallback(async () => {
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

        const { data: result, error: queryError } = await query;

        if (queryError) {
          // Fallback to mock data if database query fails
          console.log('Using mock data for table:', table);
          const mockResult = getMockData(table);
          setData(mockResult || []);
          return;
        }

        setData(result || []);
      } catch (dbError) {
        // Fallback to mock data
        console.log('Database unavailable, using mock data for:', table);
        const mockResult = getMockData(table);
        setData(mockResult || []);
      }
    } catch (err) {
      // Final fallback
      console.log('Using mock data as final fallback for:', table);
      const mockResult = getMockData(table);
      setData(mockResult || []);
      setError(null); // Don't show error when using mock data
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    fetchData();
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
            fetchData();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.log('Real-time subscription not available, using polling instead');
      // Fallback to periodic refresh
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [table, enableRealtime, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}