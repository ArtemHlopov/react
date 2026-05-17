import { useCallback } from 'react';

export const useLocalStorage = (key: string) => {
  const getLsValue = useCallback(
    (fallback = ''): string => {
      const storedValue = localStorage.getItem(key);

      return storedValue ?? fallback;
    },
    [key]
  );

  const setLsValue = useCallback(
    (value: string): void => {
      localStorage.setItem(key, value);
    },
    [key]
  );

  const removeLsValue = useCallback((): void => {
    localStorage.removeItem(key);
  }, [key]);

  return { getLsValue, setLsValue, removeLsValue };
};
