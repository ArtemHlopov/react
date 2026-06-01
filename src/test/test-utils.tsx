import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createAppStore, type AppStore } from '../store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore;
}

export const renderWithProviders = (
  ui: ReactElement,
  { store = createAppStore(), ...renderOptions }: ExtendedRenderOptions = {}
) => ({
  store,
  ...render(<Provider store={store}>{ui}</Provider>, renderOptions),
});
