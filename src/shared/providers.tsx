'use client';
import type { ReactNode } from 'react';
import { DarkThemeProvider } from './context/appThemeContextProvider';
import { store } from '../store/store';
import { Provider } from 'react-redux';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <DarkThemeProvider>{children}</DarkThemeProvider>
    </Provider>
  );
}
