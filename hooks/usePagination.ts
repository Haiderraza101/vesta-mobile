import { useState, useCallback } from 'react';

interface UsePaginationOptions<T> {
  fetchData: (page: number, limit: number) => Promise<T[]>;
  limit?: number;
}

export function usePagination<T>({ fetchData, limit = 10 }: UsePaginationOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const newData = await fetchData(1, limit);
      setData(newData);
      setPage(1);
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error("Pagination Error:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, limit]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newData = await fetchData(nextPage, limit);
      setData(prev => [...prev, ...newData]);
      setPage(nextPage);
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error("Load More Error:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, fetchData, limit]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const newData = await fetchData(1, limit);
      setData(newData);
      setPage(1);
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error("Refresh Error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, limit]);

  return {
    data,
    loading,
    loadingMore,
    refreshing,
    hasMore,
    loadInitialData,
    loadMore,
    refresh,
    setData
  };
}
