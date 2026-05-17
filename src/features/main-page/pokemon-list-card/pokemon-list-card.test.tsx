import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
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

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
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

const LocationDisplay = () => {
  const location = useLocation();

  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
    </div>
  );
};

const renderCard = (initialEntry = '/?page=2') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PokemonListCard pokemonBaseInfo={mockPokemonBaseInfo} />
              <LocationDisplay />
            </>
          }
        />
        <Route
          path="/details/:name"
          element={
            <>
              <div>Pokemon details route</div>
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe('PokemonListCard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the loading state first and then renders fetched details', async () => {
    const deferred = createDeferred<PokemonDetails>();
    vi.spyOn(apiService, 'getPokemonDetails').mockReturnValueOnce(
      deferred.promise
    );

    renderCard();

    expect(
      screen.getByRole('heading', { name: 'Unknown pokemon' })
    ).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(apiService.getPokemonDetails).toHaveBeenCalledWith(
      mockPokemonBaseInfo.url
    );

    deferred.resolve(createPokemonDetails());

    expect(
      await screen.findByRole('heading', { name: 'Pikachu' })
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

    renderCard();

    expect(await screen.findByAltText('Pikachu')).toHaveAttribute(
      'src',
      expectedSrc
    );
  });

  it('shows an error message when fetching details fails', async () => {
    vi.spyOn(apiService, 'getPokemonDetails').mockRejectedValueOnce(
      new Error('Pokemon not found')
    );

    renderCard();

    expect(
      await screen.findByText('Error: Pokemon not found')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Unknown pokemon' })
    ).toBeInTheDocument();
  });

  it('navigates to the details route and preserves search params after loading', async () => {
    const user = userEvent.setup();

    vi.spyOn(apiService, 'getPokemonDetails').mockResolvedValueOnce(
      createPokemonDetails()
    );

    renderCard('/?page=3');

    await user.click(await screen.findByRole('heading', { name: 'Pikachu' }));

    expect(await screen.findByText('Pokemon details route')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/details/pikachu?page=3'
    );
  });
});
