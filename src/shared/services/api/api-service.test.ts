import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiService } from './api-service'; // 👈 ваш путь
import type { PokemonListResponse, PokemonDetails } from '../../models';

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

describe('ApiService', () => {
  beforeEach(() => {
    apiService.setOffsetValue(0);
    apiService.setLimitValue(10);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getItemsList', () => {
    it('return pokemon list response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPokemonList),
      } as Response);

      const result = await apiService.getItemsList();

      expect(result).toEqual(mockPokemonList);
      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
      );
    });

    it('use current offset/limits', async () => {
      apiService.setOffsetValue(20);
      apiService.setLimitValue(5);

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPokemonList),
      } as Response);

      await apiService.getItemsList();

      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=5&offset=20'
      );
    });

    it.each([
      { status: 404, expected: 'Pokemon list not found' },
      { status: 400, expected: 'Bad pokemon list request' },
      { status: 500, expected: 'Server error, try again later' },
      { status: 418, expected: 'Unknown error' },
    ])(
      'throw error depending on status on getList request',
      async ({ status, expected }) => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
          ok: false,
          status,
        } as Response);

        await expect(apiService.getItemsList()).rejects.toThrow(expected);
      }
    );
  });

  describe('getPokemonDetails', () => {
    it('gets pokemon details', async () => {
      const testUrl = 'https://pokeapi.co/api/v2/pokemon/test';

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPokemonDetails),
      } as Response);

      const result = await apiService.getPokemonDetails(testUrl);

      expect(result).toEqual(mockPokemonDetails);
      expect(fetch).toHaveBeenCalledWith(testUrl);
    });

    it.each([
      { status: 404, expected: 'Pokemon not found' },
      { status: 400, expected: 'Bad request' },
      { status: 500, expected: 'Server error, try again later' },
      { status: 403, expected: 'Unknown error' },
    ])(
      'throw error depending on status on getDetails request',
      async ({ status, expected }) => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
          ok: false,
          status,
        } as Response);

        await expect(
          apiService.getPokemonDetails('https://example.com/pokemon/1')
        ).rejects.toThrow(expected);
      }
    );
  });

  describe('getPokemonLink', () => {
    it('return correct url', () => {
      expect(apiService.getPokemonLink('Pikachu')).toBe(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
    });

    it('set props to lowercase', () => {
      expect(apiService.getPokemonLink('CHARIZARD')).toBe(
        'https://pokeapi.co/api/v2/pokemon/charizard'
      );
    });
  });

  describe('setOffsetValue / setLimitValue', () => {
    it('set offset', () => {
      apiService.setOffsetValue(42);
      expect(apiService.offset).toBe(42);
    });

    it('set limit', () => {
      apiService.setLimitValue(25);
      expect(apiService.limit).toBe(25);
    });
  });
});
