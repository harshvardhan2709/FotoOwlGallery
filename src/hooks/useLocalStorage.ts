import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadStoredData() {
      try {
        setLoading(true);
        const item = await AsyncStorage.getItem(key);
        if (isMounted) {
          setStoredValue(item ? JSON.parse(item) : initialValue);
          setError(null);
        }
      } catch (err: any) {
        console.error(`[useLocalStorage] Error reading key "${key}":`, err);
        if (isMounted) {
          setError(err?.message || 'Failed to read from local storage');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStoredData();
    return () => {
      isMounted = false;
    };
  }, [key]);

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err: any) {
        console.error(`[useLocalStorage] Error saving key "${key}":`, err);
        setError(err?.message || 'Failed to save to local storage');
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (err: any) {
      console.error(`[useLocalStorage] Error removing key "${key}":`, err);
      setError(err?.message || 'Failed to remove from local storage');
    }
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue, loading, error };
}
