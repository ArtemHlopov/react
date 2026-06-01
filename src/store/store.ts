import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonsReducer from './selectedPokemonSlice';
import { pokemonApi } from '../shared/services/api/api-service';

export const createAppStore = () =>
  configureStore({
    reducer: {
      selectedPokemons: selectedPokemonsReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    devTools: true,
  });

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
