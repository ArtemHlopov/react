import type { PokemonListResponse } from '../models';
import {
  getPokemonDetailsUrl,
  POKEMON_API_BASE_URL,
} from './api/api-service';
import { DEFAULT_LIMIT } from '../constants';

export async function fetchPokemonPageData(
  query: string | undefined,
  page: string | undefined,
  limit: string | undefined
): Promise<{ data: PokemonListResponse | null; errorMsg: string }> {
  const currentPage = page ? Number(page) : 1;
  const currentLimit = limit ? Number(limit) : DEFAULT_LIMIT;
  const searchQuery = (query || '').trim().toLowerCase();
  const offset = (currentPage - 1) * currentLimit;

  let data: PokemonListResponse | null = null;
  let errorMsg = '';

  try {
    if (searchQuery) {
      const res = await fetch(getPokemonDetailsUrl(searchQuery), {
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const pokemon = await res.json();
        data = {
          count: 1,
          next: null,
          previous: null,
          results: [{ name: pokemon.name, url: getPokemonDetailsUrl(pokemon.name) }],
        };
      } else {
        errorMsg = `Pokemon "${searchQuery}" not found`;
      }
    } else {
      const res = await fetch(
        `${POKEMON_API_BASE_URL}/pokemon?limit=${currentLimit}&offset=${offset}`,
        { next: { revalidate: 300 } }
      );
      if (res.ok) {
        data = await res.json();
      } else {
        errorMsg = 'Failed to load pokemon list';
      }
    }
  } catch {
    errorMsg = 'Network error';
  }

  return { data, errorMsg };
}
