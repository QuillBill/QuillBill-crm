import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

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

      if (queryError) throw queryError;

      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
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
  }, [table, enableRealtime, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}