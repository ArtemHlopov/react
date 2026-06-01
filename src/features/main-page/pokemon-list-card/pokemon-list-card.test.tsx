import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PokemonListCard } from './pokemon-list-card';
import type {
  PokemonDetails,
  PokemonListResponseResult,
} from '../../../shared/models';
import { renderWithProviders } from '../../../test/test-utils';

const mockPokemonBaseInfo: PokemonListResponseResult = {
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
};

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
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

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const getRequestUrl = (request: RequestInfo | URL): string =>
  request instanceof Request ? request.url : request.toString();

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
  renderWithProviders(
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
    const deferred = createDeferred<Response>();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockReturnValueOnce(deferred.promise);

    renderCard();

    expect(
      screen.getByRole('heading', { name: 'Unknown pokemon' })
    ).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(getRequestUrl(fetchSpy.mock.calls[0][0])).toBe(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
    });

    deferred.resolve(jsonResponse(createPokemonDetails()));

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
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse(details));

    renderCard();

    expect(await screen.findByAltText('Pikachu')).toHaveAttribute(
      'src',
      expectedSrc
    );
  });

  it('shows an error message when fetching details fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      jsonResponse({ detail: 'Not found' }, 404)
    );

    renderCard();

    expect(
      await screen.findByText(
        'Error: Pokemon not found. Check the name and try again.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Unknown pokemon' })
    ).toBeInTheDocument();
  });

  it('navigates to the details route and preserves search params after loading', async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      jsonResponse(createPokemonDetails())
    );

    renderCard('/?page=3');

    await user.click(await screen.findByRole('heading', { name: 'Pikachu' }));

    expect(await screen.findByText('Pokemon details route')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/details/pikachu?page=3'
    );
  });
});
