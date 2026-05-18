import { useCallback, useState } from 'react';

export function useLocalStorage(key: string, initialValue: string) {
  const [storedValue, setStoredValue] = useState(() => {
    return localStorage.getItem(key) ?? initialValue;
  });

  const setValue = useCallback(
    (nextValue: string) => {
      localStorage.setItem(key, nextValue);
      setStoredValue(nextValue);
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
