import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonListResponse, PokemonDetails } from '../../models';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_CACHE_TTL_SECONDS = 300;

const configuredCacheTtl = Number(
  import.meta.env.VITE_RTK_QUERY_CACHE_TTL_SECONDS
);
const cacheTtl = Number.isFinite(configuredCacheTtl)
  ? configuredCacheTtl
  : DEFAULT_CACHE_TTL_SECONDS;

export const getPokemonDetailsUrl = (name: string): string =>
  `${POKEMON_API_BASE_URL}/pokemon/${name.toLowerCase()}`;

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: POKEMON_API_BASE_URL,
  }),
  keepUnusedDataFor: cacheTtl,
  tagTypes: ['PokemonList', 'PokemonDetails'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<
      PokemonListResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => ({
        url: 'pokemon',
        params: { limit, offset },
      }),
      providesTags: ['PokemonList'],
    }),
    getPokemonDetails: builder.query<PokemonDetails, string>({
      query: (name) => `pokemon/${name.toLowerCase()}`,
      providesTags: (_result, _error, name) => [
        { type: 'PokemonDetails', id: name.toLowerCase() },
      ],
    }),
  }),
});

export const { useGetPokemonListQuery, useGetPokemonDetailsQuery } = pokemonApi;

class PaginationService {
  offset: number = 0;
  limit: number = 10;

  setOffsetValue(value: number) {
    this.offset = value;
  }

  setLimitValue(value: number) {
    this.limit = value;
  }
}

export const paginationService = new PaginationService();
