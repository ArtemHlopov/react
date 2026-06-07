import { configureStore } from '@reduxjs/toolkit';
import submittedFormsReducer from './submitted-form-slice';

const createAppStore = () =>
  configureStore({
    reducer: {
      submittedForms: submittedFormsReducer,
    },
    devTools: true,
  });

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
