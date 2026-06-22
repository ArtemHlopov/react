import { DetailsPanel } from '../../../../features/main-page/details-panel/details-panel';
import type { PokemonListResponse } from '../../../../shared/models';
import {
  getPokemonDetailsUrl,
  POKEMON_API_BASE_URL,
} from '../../../../shared/services/api/api-service';
import SearchResultLayout from '../../../../shared/components/search-result-layout/search-result-layout';
import { SearchField } from '../../../../features/main-page/search-field/search-field';
import { ResultList } from '../../../../features/main-page/result-list/result-list';
import { ResultListPagination } from '../../../../features/main-page/result-list-pagination/result-list-pagination';
import { DEFAULT_LIMIT } from '../../../../shared/constants';

interface DetailsPageProps {
  searchParams: Promise<{ page?: string; query?: string; limit?: string }>;
}

export default async function DetailsPage({ searchParams }: DetailsPageProps) {
  const { page, query, limit } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || DEFAULT_LIMIT;
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
          results: [
            {
              name: pokemon.name,
              url: getPokemonDetailsUrl(pokemon.name),
            },
          ],
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

  return (
    <div className="main_page_wrapper">
      <SearchResultLayout>
        <SearchField filter={searchQuery} />
        <ResultList list={data?.results || []} errorMsg={errorMsg} />
        {data && (
          <ResultListPagination
            total={data.count}
            next={data.next}
            previous={data.previous}
            disabled={!!searchQuery}
          />
        )}
      </SearchResultLayout>
      <DetailsPanel />
    </div>
  );
}
