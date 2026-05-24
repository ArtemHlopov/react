import { createContext } from 'react';

interface DarkThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

export const DarkThemeContext = createContext<DarkThemeContextType>({
  isDarkTheme: false,
  toggleTheme: () => {},
});
