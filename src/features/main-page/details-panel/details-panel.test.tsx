import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DetailsPanel } from './details-panel';
import type { PokemonDetails } from '../../../shared/models';
import { renderWithProviders } from '../../../test/test-utils';

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
};

const mockPokemonDetails: PokemonDetails = {
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
};

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

const renderPanel = (initialEntry: string, path = '/details/:name') =>
  renderWithProviders(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path={path}
          element={
            <>
              <DetailsPanel />
              <LocationDisplay />
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
              <div>Back on main page</div>
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe('DetailsPanel', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a fallback message when the route has no pokemon name', () => {
    renderPanel('/', '/');

    expect(screen.getByText('No details found.')).toBeInTheDocument();
  });

  it('shows a loading state and then renders pokemon details', async () => {
    const deferred = createDeferred<Response>();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockReturnValueOnce(deferred.promise);

    renderPanel('/details/pikachu?page=3');

    expect(await screen.findByText('Loading details...')).toBeInTheDocument();
    expect(getRequestUrl(fetchSpy.mock.calls[0][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );

    deferred.resolve(jsonResponse(mockPokemonDetails));

    expect(
      await screen.findByRole('heading', { name: 'pikachu' })
    ).toBeInTheDocument();
    expect(screen.getByText('Height: 4')).toBeInTheDocument();
    expect(screen.getByText('Weight: 60')).toBeInTheDocument();
    expect(screen.getByText('Types: electric')).toBeInTheDocument();
    expect(screen.getByAltText('pikachu')).toHaveAttribute(
      'src',
      'https://img.test/official.png'
    );
  });

  it('shows the request error message when loading fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      jsonResponse({ detail: 'Not found' }, 404)
    );

    renderPanel('/details/pikachu?page=3');

    expect(
      await screen.findByText('Pokemon not found. Check the name and try again.')
    ).toBeInTheDocument();
  });

  it('closes the panel and preserves the current search params', async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      jsonResponse(mockPokemonDetails)
    );

    renderPanel('/details/pikachu?page=4&limit=20');

    await user.click(screen.getByRole('button', { name: 'X' }));

    expect(await screen.findByText('Back on main page')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/?page=4&limit=20'
    );
  });
});
