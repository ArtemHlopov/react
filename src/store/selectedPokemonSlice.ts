import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PokemonListResponseResult } from '../shared/models';
import type { RootState } from './store';

interface SelectedPokemonsState {
  selectedPokemon: PokemonListResponseResult[];
}

const initialState: SelectedPokemonsState = {
  selectedPokemon: [],
};

const selectedPokemonsSlice = createSlice({
  name: 'selectedPokemons',
  initialState: initialState,
  reducers: {
    toggleSelectedPokemon: (
      state,
      action: PayloadAction<PokemonListResponseResult>
    ) => {
      const pokemonName = action.payload;
      const exist = state.selectedPokemon.find(
        (pokemon) => pokemon.name === pokemonName.name
      );
      if (exist) {
        state.selectedPokemon = state.selectedPokemon.filter(
          (pokemon) => pokemon.name !== pokemonName.name
        );
      } else {
        state.selectedPokemon.push(action.payload);
      }
    },
    clearSelectedPokemons: (state) => {
      state.selectedPokemon = [];
    },
  },
});

export const { toggleSelectedPokemon, clearSelectedPokemons } =
  selectedPokemonsSlice.actions;

export const selectedPokemonsSelector = (state: RootState) =>
  state.selectedPokemons.selectedPokemon;

export default selectedPokemonsSlice.reducer;
