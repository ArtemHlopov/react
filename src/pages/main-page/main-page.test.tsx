import { MemoryRouter } from 'react-router-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MainPage } from './main-page';
import { LS_FILTER_KEY } from '../../shared/constants';
import { apiService } from '../../shared/services/api/api-service';
import type { PokemonListResponse } from '../../shared/models';

const mockListResponse: PokemonListResponse = {
  count: 2,
  next: 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=10',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const nextPageResponse: PokemonListResponse = {
  count: 2,
  next: null,
  previous: 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0',
  results: [{ name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' }],
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
    apiService.setOffsetValue(0);
    apiService.setLimitValue(10);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the pokemon list on mount and shows a loading indicator while waiting', async () => {
    const deferred = createDeferred<PokemonListResponse>();
    vi.spyOn(apiService, 'getItemsList').mockReturnValueOnce(deferred.promise);

    render(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('img', { name: 'Loading pokemon' })
    ).toBeInTheDocument();

    await act(async () => {
      deferred.resolve(mockListResponse);
      await deferred.promise;
    });

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('Total items: 2')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: 'Loading pokemon' })
      ).not.toBeInTheDocument();
    });
  });

  it('uses the initial filter to build a single pokemon result instead of loading the list', async () => {
    const getItemsListSpy = vi.spyOn(apiService, 'getItemsList');
    const getPokemonLinkSpy = vi
      .spyOn(apiService, 'getPokemonLink')
      .mockReturnValue('https://pokeapi.co/api/v2/pokemon/pikachu');

    render(
      <MemoryRouter>
        <MainPage filter="Pikachu" />
      </MemoryRouter>
    );

    expect(await screen.findByText('Pikachu')).toBeInTheDocument();
    expect(getItemsListSpy).not.toHaveBeenCalled();
    expect(getPokemonLinkSpy).toHaveBeenCalledWith('Pikachu');
    expect(screen.getByText('Search filter: Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Pagination disabled: true')).toBeInTheDocument();
  });

  it('stores a trimmed search term in localStorage and renders the searched pokemon', async () => {
    const user = userEvent.setup();
    vi.spyOn(apiService, 'getItemsList').mockResolvedValueOnce(
      mockListResponse
    );
    const getPokemonLinkSpy = vi
      .spyOn(apiService, 'getPokemonLink')
      .mockReturnValue('https://pokeapi.co/api/v2/pokemon/bulbasaur');

    render(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search bulbasaur' }));

    expect(localStorage.getItem(LS_FILTER_KEY)).toBe('bulbasaur');
    expect(getPokemonLinkSpy).toHaveBeenCalledWith('bulbasaur');
    expect(
      await screen.findByText('Search filter: bulbasaur')
    ).toBeInTheDocument();
    expect(screen.getByText('Pagination disabled: true')).toBeInTheDocument();
  });

  it('reloads the full list when the search term is cleared', async () => {
    const user = userEvent.setup();
    const getItemsListSpy = vi
      .spyOn(apiService, 'getItemsList')
      .mockResolvedValueOnce(mockListResponse);

    render(
      <MemoryRouter>
        <MainPage filter="pikachu" />
      </MemoryRouter>
    );

    expect(await screen.findByText('pikachu')).toBeInTheDocument();

    getItemsListSpy.mockResolvedValueOnce(mockListResponse);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(localStorage.getItem(LS_FILTER_KEY)).toBe('');
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('shows the default error message when loading the list fails', async () => {
    vi.spyOn(apiService, 'getItemsList').mockRejectedValueOnce(
      new Error('Network issue')
    );

    render(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(
      await screen.findByText('Troubles with loading data')
    ).toBeInTheDocument();
  });

  it('uses the saved filter from localStorage when the prop is empty', async () => {
    const getItemsListSpy = vi.spyOn(apiService, 'getItemsList');
    const getPokemonLinkSpy = vi
      .spyOn(apiService, 'getPokemonLink')
      .mockReturnValue('https://pokeapi.co/api/v2/pokemon/charizard');

    localStorage.setItem(LS_FILTER_KEY, 'charizard');

    render(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('charizard')).toBeInTheDocument();
    expect(getItemsListSpy).not.toHaveBeenCalled();
    expect(getPokemonLinkSpy).toHaveBeenCalledWith('charizard');
    expect(screen.getByText('Pagination disabled: true')).toBeInTheDocument();
  });

  it('changes the page and requests a fresh list when the next page is selected', async () => {
    const user = userEvent.setup();
    vi.spyOn(apiService, 'getItemsList')
      .mockResolvedValueOnce(mockListResponse)
      .mockResolvedValueOnce(nextPageResponse);
    const setOffsetValueSpy = vi.spyOn(apiService, 'setOffsetValue');

    render(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(setOffsetValueSpy).toHaveBeenCalledWith(10);
    expect(await screen.findByText('venusaur')).toBeInTheDocument();
  });

  it('updates the limit and reloads the list when a new page size is selected', async () => {
    const user = userEvent.setup();
    apiService.setOffsetValue(30);

    vi.spyOn(apiService, 'getItemsList')
      .mockResolvedValueOnce(mockListResponse)
      .mockResolvedValueOnce(mockListResponse);
    const setOffsetValueSpy = vi.spyOn(apiService, 'setOffsetValue');
    const setLimitValueSpy = vi.spyOn(apiService, 'setLimitValue');

    render(
      <MemoryRouter>
        <MainPage filter="" />
      </MemoryRouter>
    );

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Set limit 20' }));

    expect(setOffsetValueSpy).toHaveBeenCalledWith(0);
    expect(setLimitValueSpy).toHaveBeenCalledWith(20);
  });
});
