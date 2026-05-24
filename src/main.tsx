import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './features/router/router';
import { DarkThemeProvider } from './shared/context/appThemeContextProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DarkThemeProvider>
      <RouterProvider router={router} />
    </DarkThemeProvider>
  </StrictMode>
);
