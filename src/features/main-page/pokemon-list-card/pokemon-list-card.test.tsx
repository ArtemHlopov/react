import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PokemonListCard } from './pokemon-list-card';
import { apiService } from '../../../shared/services/api/api-service';
import type {
  PokemonDetails,
  PokemonListResponseResult,
} from '../../../shared/models';

const mockPokemonBaseInfo: PokemonListResponseResult = {
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
};

const createPokemonDetails = (
  overrides: Partial<PokemonDetails> = {}
): PokemonDetails => ({
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [
    {
      slot: 1,
      type: {
        name: 'electric',
        url: 'https://pokeapi.co/api/v2/type/13/',
      },
    },
  ],
  sprites: {
    front_default: null,
    other: {
      'official-artwork': {
        front_default: 'https://img.test/official.png',
      },
      home: {
        front_default: 'https://img.test/home.png',
      },
      dream_world: {
        front_default: 'https://img.test/dream-world.svg',
      },
    },
  },
  ...overrides,
});

describe('PokemonListCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows loading state first and fetches details after the minimum delay', async () => {
    vi.spyOn(apiService, 'getPokemonDetails').mockResolvedValueOnce(
      createPokemonDetails()
    );

    render(<PokemonListCard pokemonBaseInfo={mockPokemonBaseInfo} />);

    expect(
      screen.getByRole('heading', { name: 'Unknown pokemon' })
    ).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(apiService.getPokemonDetails).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(apiService.getPokemonDetails).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(apiService.getPokemonDetails).toHaveBeenCalledWith(
      mockPokemonBaseInfo.url
    );

    expect(
      screen.getByRole('heading', { name: 'Pikachu' })
    ).toBeInTheDocument();
    expect(screen.getByText('Types: electric')).toBeInTheDocument();
    expect(screen.getByAltText('Pikachu')).toHaveAttribute(
      'src',
      'https://img.test/official.png'
    );
  });

  it.each([
    {
      title: 'home artwork when official artwork is missing',
      details: createPokemonDetails({
        sprites: {
          front_default: null,
          other: {
            'official-artwork': { front_default: null },
            home: { front_default: 'https://img.test/home.png' },
            dream_world: { front_default: 'https://img.test/dream-world.svg' },
          },
        },
      }),
      expectedSrc: 'https://img.test/home.png',
    },
    {
      title:
        'dream world artwork when official artwork and home artwork are missing',
      details: createPokemonDetails({
        sprites: {
          front_default: null,
          other: {
            'official-artwork': { front_default: null },
            home: { front_default: null },
            dream_world: { front_default: 'https://img.test/dream-world.svg' },
          },
        },
      }),
      expectedSrc: 'https://img.test/dream-world.svg',
    },
  ])('uses $title', async ({ details, expectedSrc }) => {
    vi.spyOn(apiService, 'getPokemonDetails').mockResolvedValueOnce(details);

    render(<PokemonListCard pokemonBaseInfo={mockPokemonBaseInfo} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(screen.getByAltText('Pikachu')).toHaveAttribute('src', expectedSrc);
  });

  it('shows an error message when fetching details fails', async () => {
    vi.spyOn(apiService, 'getPokemonDetails').mockRejectedValueOnce(
      new Error('Pokemon not found')
    );

    render(<PokemonListCard pokemonBaseInfo={mockPokemonBaseInfo} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(screen.getByText('Error: Pokemon not found')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Unknown pokemon' })
    ).toBeInTheDocument();
  });

  it('clears the pending fetch timeout on unmount', () => {
    const getPokemonDetailsSpy = vi
      .spyOn(apiService, 'getPokemonDetails')
      .mockResolvedValue(createPokemonDetails());

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = render(
      <PokemonListCard pokemonBaseInfo={mockPokemonBaseInfo} />
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(getPokemonDetailsSpy).not.toHaveBeenCalled();
  });
});
