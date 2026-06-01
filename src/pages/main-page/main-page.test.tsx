import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MainPage } from './main-page';
import { LS_FILTER_KEY } from '../../shared/constants';
import { paginationService } from '../../shared/services/api/api-service';
import type { PokemonDetails, PokemonListResponse } from '../../shared/models';
import { renderWithProviders } from '../../test/test-utils';

const mockListResponse: PokemonListResponse = {
  count: 30,
  next: 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=10',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const nextPageResponse: PokemonListResponse = {
  count: 30,
  next: null,
  previous: 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0',
  results: [{ name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' }],
};

const mockPokemonDetails: PokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const getRequestUrl = (request: RequestInfo | URL): string =>
  request instanceof Request ? request.url : request.toString();

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
};

vi.mock('../../features/main-page/search-field/search-field', () => ({
  SearchField: ({
    filter,
    onFilterChange,
  }: {
    filter: string;
    onFilterChange?: (value?: unknown) => void;
  }) => (
    <div>
      <div>Search filter: {filter}</div>
      <button onClick={() => onFilterChange?.(' bulbasaur ')}>
        Search bulbasaur
      </button>
      <button onClick={() => onFilterChange?.('')}>Clear search</button>
    </div>
  ),
}));

vi.mock('../../features/main-page/result-list/result-list', () => ({
  ResultList: ({
    list,
    errorMsg,
  }: {
    list: { name: string; url: string }[];
    errorMsg?: string;
  }) => (
    <div>
      {errorMsg ? (
        <div>{errorMsg}</div>
      ) : list.length > 0 ? (
        list.map((item) => <div key={item.url}>{item.name}</div>)
      ) : (
        <div>No results</div>
      )}
    </div>
  ),
}));

vi.mock(
  '../../features/main-page/result-list-pagination/result-list-pagination',
  () => ({
    ResultListPagination: ({
      total,
      disabled,
      next,
      previous,
      onOffsetChange,
      onLimitChange,
    }: {
      total: number | string;
      disabled: boolean;
      next: string | null;
      previous: string | null;
      onOffsetChange?: (value?: unknown) => void;
      onLimitChange?: (value?: unknown) => void;
    }) => (
      <div>
        <div>Total items: {total}</div>
        <div>Pagination disabled: {String(disabled)}</div>
        <button disabled={!previous} onClick={() => onOffsetChange?.()}>
          Previous page
        </button>
        <button disabled={!next} onClick={() => onOffsetChange?.(true)}>
          Next page
        </button>
        <button onClick={() => onLimitChange?.(20)}>Set limit 20</button>
      </div>
    ),
  })
);

describe('MainPage', () => {
  beforeEach(() => {
    localStorage.clear();
    paginationService.setOffsetValue(0);
    paginationService.setLimitValue(10);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the pokemon list on mount and shows a loading indicator while waiting', async () => {
    const deferred = createDeferred<Response>();

    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(deferred.promise);

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('img', { name: 'Loading pokemon' })
    ).toBeInTheDocument();

    deferred.resolve(jsonResponse(mockListResponse));

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('Total items: 30')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: 'Loading pokemon' })
      ).not.toBeInTheDocument();
    });
  });

  it('uses the initial filter to fetch a single pokemon result instead of loading the list', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({ ...mockPokemonDetails, name: 'pikachu' })
      );

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="Pikachu" />
      </MemoryRouter>
    );

    expect(await screen.findByText('pikachu')).toBeInTheDocument();
    expect(getRequestUrl(fetchSpy.mock.calls[0][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Search filter: Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Pagination disabled: true')).toBeInTheDocument();
  });

  it('stores a trimmed search term in localStorage and renders the searched pokemon', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(mockListResponse))
      .mockResolvedValueOnce(jsonResponse(mockPokemonDetails));

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('ivysaur')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search bulbasaur' }));

    expect(localStorage.getItem(LS_FILTER_KEY)).toBe('bulbasaur');
    expect(
      await screen.findByText('Search filter: bulbasaur')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Pagination disabled: true')
    ).toBeInTheDocument();
    expect(getRequestUrl(fetchSpy.mock.calls[1][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon/bulbasaur'
    );
  });

  it('reloads the full list when the search term is cleared', async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({ ...mockPokemonDetails, name: 'pikachu' })
      )
      .mockResolvedValueOnce(jsonResponse(mockListResponse));

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="pikachu" />
      </MemoryRouter>
    );

    expect(await screen.findByText('pikachu')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(localStorage.getItem(LS_FILTER_KEY)).toBe('');
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('shows a clear error message when loading the list fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      jsonResponse({ detail: 'Server error' }, 500)
    );

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(
      await screen.findByText('Server error. Try again later.')
    ).toBeInTheDocument();
  });

  it('shows a clear error message when the searched pokemon fails to load', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      jsonResponse({ detail: 'Not found' }, 404)
    );

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="missingno" />
      </MemoryRouter>
    );

    expect(
      await screen.findByText('Pokemon not found. Check the name and try again.')
    ).toBeInTheDocument();
  });

  it('uses the saved filter from localStorage when the prop is empty', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({ ...mockPokemonDetails, name: 'charizard' })
      );

    localStorage.setItem(LS_FILTER_KEY, 'charizard');

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('charizard')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(getRequestUrl(fetchSpy.mock.calls[0][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon/charizard'
    );
    expect(screen.getByText('Pagination disabled: true')).toBeInTheDocument();
  });

  it('changes the page and requests a fresh list when the next page is selected', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(mockListResponse))
      .mockResolvedValueOnce(jsonResponse(nextPageResponse));

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(await screen.findByText('venusaur')).toBeInTheDocument();
    expect(getRequestUrl(fetchSpy.mock.calls[1][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=10'
    );
  });

  it('updates the limit and reloads the list when a new page size is selected', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(mockListResponse))
      .mockResolvedValueOnce(jsonResponse(mockListResponse));

    renderWithProviders(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Set limit 20' }));

    expect(paginationService.limit).toBe(20);
    expect(getRequestUrl(fetchSpy.mock.calls[1][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
    );
  });
});
