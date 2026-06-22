import { describe, expect, it } from 'vitest';
import reducer, {
  toggleSelectedPokemon,
  clearSelectedPokemons,
  selectedPokemonsSelector,
} from './selectedPokemonSlice';
import type { RootState } from './store';

describe('selectedPokemonSlice', () => {
  const initialState = {
    selectedPokemon: [],
  };

  const mockPokemon1 = {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  };

  const mockPokemon2 = {
    name: 'ivysaur',
    url: 'https://pokeapi.co/api/v2/pokemon/2/',
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add a pokemon if it does not exist in selections', () => {
    const nextState = reducer(initialState, toggleSelectedPokemon(mockPokemon1));
    expect(nextState.selectedPokemon).toEqual([mockPokemon1]);
  });

  it('should remove a pokemon if it already exists in selections', () => {
    const stateWithPokemon = {
      selectedPokemon: [mockPokemon1, mockPokemon2],
    };
    const nextState = reducer(
      stateWithPokemon,
      toggleSelectedPokemon(mockPokemon1)
    );
    expect(nextState.selectedPokemon).toEqual([mockPokemon2]);
  });

  it('should clear all selected pokemons', () => {
    const stateWithPokemons = {
      selectedPokemon: [mockPokemon1, mockPokemon2],
    };
    const nextState = reducer(stateWithPokemons, clearSelectedPokemons());
    expect(nextState.selectedPokemon).toEqual([]);
  });

  it('should select selected pokemons from state', () => {
    const mockRootState = {
      selectedPokemons: {
        selectedPokemon: [mockPokemon1],
      },
    } as RootState;

    expect(selectedPokemonsSelector(mockRootState)).toEqual([mockPokemon1]);
  });
});
