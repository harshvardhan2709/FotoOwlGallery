import { useCallback, useState } from 'react';
import { useDebounce } from './useDebounce';

export interface UseSearchReturn {
  searchQuery: string;
  debouncedQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

export function useSearch(initialValue: string = '', delayMs: number = 300): UseSearchReturn {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(searchQuery, delayMs);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
    clearSearch,
    isSearching: searchQuery.trim().length > 0,
  };
}
