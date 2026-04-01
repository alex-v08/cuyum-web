import { useState, useCallback } from 'react';
import { isBrowser } from '@/lib/utils';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser()) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (isBrowser()) {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // ignore write errors
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
