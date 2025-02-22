import React from 'react';

export function useLocalStorage<Type>(keyName: string, defaultValue: Type) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (_err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: Type) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.error(`Error saving to localStorage:`, err);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}
