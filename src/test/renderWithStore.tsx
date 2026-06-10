import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import submittedFormsReducer from '../store/submitted-form-slice';
import countriesReducer from '../store/countries-slice';

export function makeStore() {
  return configureStore({
    reducer: {
      submittedForms: submittedFormsReducer,
      countries: countriesReducer,
    },
  });
}

export function renderWithStore(ui: ReactElement) {
  const store = makeStore();
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}
