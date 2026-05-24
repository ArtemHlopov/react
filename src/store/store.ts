import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonsReducer from './selectedPokemonSlice';

export const store = configureStore({
  reducer: {
    selectedPokemons: selectedPokemonsReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
