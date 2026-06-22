'use client';
import { useCallback } from 'react';

export const useLocalStorage = (key: string) => {
  const getLsValue = useCallback(
    (fallback = ''): string => {
      if (typeof window === 'undefined') return fallback;
      return localStorage.getItem(key) ?? fallback;
    },
    [key]
  );

  const setLsValue = useCallback(
    (value: string): void => {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, value);
    },
    [key]
  );

  const removeLsValue = useCallback((): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }, [key]);

  return { getLsValue, setLsValue, removeLsValue };
};
