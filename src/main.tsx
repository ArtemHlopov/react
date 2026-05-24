import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './features/router/router';
import { DarkThemeProvider } from './shared/context/appThemeContextProvider';
import { Provider } from 'react-redux';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <DarkThemeProvider>
        <RouterProvider router={router} />
      </DarkThemeProvider>
    </Provider>
  </StrictMode>
);
