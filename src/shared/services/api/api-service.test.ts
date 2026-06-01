import { describe, it, expect, vi, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { createAppStore } from '../../../store/store';
import {
  getPokemonDetailsUrl,
  paginationService,
  pokemonApi,
} from './api-service';
import type { PokemonDetails, PokemonListResponse } from '../../models';

const mockPokemonList: PokemonListResponse = {
  count: 100,
  next: 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=10',
  previous: null,
  results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
};

const mockPokemonDetails: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const getRequestUrl = (request: RequestInfo | URL): string =>
  request instanceof Request ? request.url : request.toString();

describe('pokemonApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the pokemon list through RTK Query with limit and offset params', async () => {
    const store = createAppStore();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(mockPokemonList));

    const subscription = store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        limit: 10,
        offset: 0,
      })
    );
    const result = await subscription.unwrap();

    expect(result).toEqual(mockPokemonList);
    expect(getRequestUrl(fetchSpy.mock.calls[0][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
    );

    subscription.unsubscribe();
  });

  it('fetches pokemon details through RTK Query', async () => {
    const store = createAppStore();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(mockPokemonDetails));

    const subscription = store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('Pikachu')
    );
    const result = await subscription.unwrap();

    expect(result).toEqual(mockPokemonDetails);
    expect(getRequestUrl(fetchSpy.mock.calls[0][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );

    subscription.unsubscribe();
  });

  it('reuses cached list data for the same query args', async () => {
    const store = createAppStore();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => Promise.resolve(jsonResponse(mockPokemonList)));
    const queryArgs = { limit: 10, offset: 0 };

    const firstSubscription = store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate(queryArgs)
    );
    await firstSubscription.unwrap();

    const secondSubscription = store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate(queryArgs)
    );
    await secondSubscription.unwrap();

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    firstSubscription.unsubscribe();
    secondSubscription.unsubscribe();
  });

  it('invalidates cached list data and refetches subscribed queries', async () => {
    const store = createAppStore();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => Promise.resolve(jsonResponse(mockPokemonList)));
    const subscription = store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({ limit: 10, offset: 0 })
    );

    await subscription.unwrap();

    store.dispatch(pokemonApi.util.invalidateTags(['PokemonList']));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    subscription.unsubscribe();
  });

  it('invalidates cached details data and refetches subscribed queries', async () => {
    const store = createAppStore();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() =>
        Promise.resolve(jsonResponse(mockPokemonDetails))
      );
    const subscription = store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('pikachu')
    );

    await subscription.unwrap();

    store.dispatch(
      pokemonApi.util.invalidateTags([{ type: 'PokemonDetails', id: 'pikachu' }])
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    subscription.unsubscribe();
  });
});

describe('getPokemonDetailsUrl', () => {
  it('returns a lowercase PokeAPI details URL', () => {
    expect(getPokemonDetailsUrl('Pikachu')).toBe(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );
  });
});

describe('paginationService', () => {
  it('stores pagination values', () => {
    paginationService.setOffsetValue(42);
    paginationService.setLimitValue(25);

    expect(paginationService.offset).toBe(42);
    expect(paginationService.limit).toBe(25);
  });
});
