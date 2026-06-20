'use client';
import { useState } from 'react';
import { DarkThemeContext } from './appThemeContext';

export const DarkThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = (): void => {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <DarkThemeContext value={{ isDarkTheme, toggleTheme }}>
      {children}
    </DarkThemeContext>
  );
};
