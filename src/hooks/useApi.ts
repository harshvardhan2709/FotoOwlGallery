import { useCallback, useEffect, useState } from 'react';

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>, immediate = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: any) {
        const errorMsg = err?.message || 'An unexpected error occurred';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}
