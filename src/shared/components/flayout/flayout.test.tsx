import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Flayout } from './flayout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonsReducer from '../../../store/selectedPokemonSlice';
import { DarkThemeContext } from '../../context/appThemeContext';

const renderFlayoutWithStore = (preloadedState = { selectedPokemon: [] }) => {
  const store = configureStore({
    reducer: {
      selectedPokemons: selectedPokemonsReducer,
    },
    preloadedState: {
      selectedPokemons: preloadedState,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <DarkThemeContext value={{ isDarkTheme: false, toggleTheme: () => {} }}>
          <Flayout />
        </DarkThemeContext>
      </Provider>
    ),
  };
};

describe('Flayout Component', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when there are no selected pokemons', () => {
    const { container } = renderFlayoutWithStore();
    expect(container.firstChild).toBeNull();
  });

  it('renders details, unselect button, and download button when items are selected', () => {
    const mockSelected = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    ];
    renderFlayoutWithStore({ selectedPokemon: mockSelected });

    expect(screen.getByText(/Selected:/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/item/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Unselect all' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Download CSV' })
    ).toBeInTheDocument();
  });

  it('dispatches clearSelectedPokemons when Unselect all is clicked', () => {
    const mockSelected = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    ];
    const { store } = renderFlayoutWithStore({
      selectedPokemon: mockSelected,
    });

    const unselectBtn = screen.getByRole('button', { name: 'Unselect all' });
    fireEvent.click(unselectBtn);

    expect(store.getState().selectedPokemons.selectedPokemon).toEqual([]);
    expect(screen.queryByRole('button', { name: 'Unselect all' })).toBeNull();
  });

  it('triggers CSV download when Download CSV button is clicked', () => {
    const mockSelected = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    ];
    renderFlayoutWithStore({ selectedPokemon: mockSelected });

    const downloadBtn = screen.getByRole('button', { name: 'Download CSV' });
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    fireEvent.click(downloadBtn);

    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
