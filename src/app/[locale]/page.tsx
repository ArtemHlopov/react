import SearchResultsLayout from '../../shared/components/search-result-layout/search-result-layout';
import { SearchField } from '../../features/main-page/search-field/search-field';
import { ResultList } from '../../features/main-page/result-list/result-list';
import { ResultListPagination } from '../../features/main-page/result-list-pagination/result-list-pagination';
import { fetchPokemonPageData } from '../../shared/services/pokemon-server-service';

interface HomePageProps {
  searchParams: Promise<{ page?: string; query?: string; limit?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page, query, limit } = await searchParams;
  const searchQuery = (query || '').trim().toLowerCase();

  const { data, errorMsg } = await fetchPokemonPageData(query, page, limit);

  return (
    <div className="main_page_wrapper">
      <SearchResultsLayout>
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
      </SearchResultsLayout>
    </div>
  );
}
