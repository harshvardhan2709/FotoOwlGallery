import { useCallback, useState } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, pageSize = 20 } = options;
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const nextPage = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoadingMore, hasMore]);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [initialPage]);

  return {
    page,
    pageSize,
    hasMore,
    setHasMore,
    isLoadingMore,
    setIsLoadingMore,
    nextPage,
    resetPagination,
  };
}
