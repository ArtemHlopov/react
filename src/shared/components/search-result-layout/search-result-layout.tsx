'use client';

import { useContext } from 'react';
import { DarkThemeContext } from '../../context/appThemeContext';
import '../../../pages/main-page/main-page.css';

interface SearchResultLayoutProps {
  children: React.ReactNode;
}

export default function SearchResultLayout({
  children,
}: SearchResultLayoutProps) {
  const { isDarkTheme } = useContext(DarkThemeContext);
  return (
    <div
      className={`main_page_left_column ${isDarkTheme ? 'main_page_left_column__dark' : ''}`}
    >
      {children}
    </div>
  );
}
