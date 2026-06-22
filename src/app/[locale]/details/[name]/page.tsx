import { DetailsPanel } from '../../../../features/main-page/details-panel/details-panel';
import type { PokemonDetails } from '../../../../shared/models';
import { POKEMON_API_BASE_URL } from '../../../../shared/services/api/api-service';
import SearchResultLayout from '../../../../shared/components/search-result-layout/search-result-layout';
import { SearchField } from '../../../../features/main-page/search-field/search-field';
import { ResultList } from '../../../../features/main-page/result-list/result-list';
import { ResultListPagination } from '../../../../features/main-page/result-list-pagination/result-list-pagination';
import { fetchPokemonPageData } from '../../../../shared/services/pokemon-server-service';

interface DetailsPageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string; query?: string; limit?: string }>;
}

export default async function DetailsPage({
  params,
  searchParams,
}: DetailsPageProps) {
  const { name } = await params;
  const { page, query, limit } = await searchParams;
  const searchQuery = (query || '').trim().toLowerCase();

  const { data, errorMsg } = await fetchPokemonPageData(query, page, limit);

  let pokemonDetails: PokemonDetails | null = null;
  let detailsError = '';
  try {
    const res = await fetch(
      `${POKEMON_API_BASE_URL}/pokemon/${name.toLowerCase()}`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      pokemonDetails = await res.json();
    } else {
      detailsError = `Pokemon "${name}" not found`;
    }
  } catch {
    detailsError = 'Network error';
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
      <DetailsPanel data={pokemonDetails} errorMsg={detailsError} />
    </div>
  );
}
