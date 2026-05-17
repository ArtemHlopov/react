import { useEffect, useState, useCallback } from 'react';
import { usePagination } from '../../shared/hooks/use-pagination';
import type { FilterProps, PokemonListResponse } from '../../shared/models';
import { SearchField } from '../../features/main-page/search-field/search-field';
import { ResultList } from '../../features/main-page/result-list/result-list';
import { LS_FILTER_KEY } from '../../shared/constants';
import { apiService } from '../../shared/services/api/api-service';
import { ResultListPagination } from '../../features/main-page/result-list-pagination/result-list-pagination';
import pokeballImage from '../../assets/pokeball.png';
import './main-page.css';

export const MainPage = ({ filter }: FilterProps) => {
  const defaultErrorMessage = 'Troubles with loading data';
  const [currentFilter, setCurrentFilter] = useState<string>(
    filter || localStorage.getItem(LS_FILTER_KEY) || ''
  );
  const { currentPage, setPage } = usePagination();
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getList = useCallback(async () => {
    setLoading(true);
    try {
      apiService.setOffsetValue((currentPage - 1) * apiService.limit);
      const data = await apiService.getItemsList();
      setData(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(defaultErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const getPokemonByName = useCallback(
    async (name: string): Promise<void> => {
      setLoading(true);

      if (!name.trim()) {
        await getList();
        return;
      }
      setData({
        next: null,
        previous: null,
        count: 1,
        results: [{ name, url: apiService.getPokemonLink(name) }],
      });
      setLoading(false);
    },
    [getList]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (currentFilter) {
        await getPokemonByName(currentFilter);
      } else {
        await getList();
      }
    };
    fetchData();
  }, [currentFilter, getList, getPokemonByName]);

  const handleNewFilter = async (value: unknown): Promise<void> => {
    const stringValue = String(value).trim();
    if (stringValue !== currentFilter) {
      localStorage.setItem(LS_FILTER_KEY, stringValue);
      setCurrentFilter(stringValue);
      setPage(1);
      if (stringValue) {
        await getPokemonByName(stringValue);
      } else {
        await getList();
      }
    }
  };

  const handleChangePage = async (isNextPage: unknown): Promise<void> => {
    if (isNextPage) {
      setPage(currentPage + 1);
    } else {
      setPage(Math.max(1, currentPage - 1));
    }
  };

  const handleLimitChange = async (value: unknown): Promise<void> => {
    if (value && typeof value === 'number') {
      apiService.setLimitValue(value);
      setPage(1);
    }
  };

  return (
    <div className="main_page_wrapper">
      {loading ? (
        <div className="main_page_loader_overlay">
          <img
            className="main_page_loader_image spin"
            src={pokeballImage}
            alt="Loading pokemon"
          />
        </div>
      ) : null}
      <SearchField filter={currentFilter} onFilterChange={handleNewFilter} />
      <ResultList list={data?.results || []} errorMsg={error || ''} />

      {!loading && data && (
        <ResultListPagination
          total={data?.count || ''}
          onOffsetChange={handleChangePage}
          onLimitChange={handleLimitChange}
          next={data?.next || null}
          previous={data?.previous || null}
          disabled={!!currentFilter}
          currentPage={currentPage}
        ></ResultListPagination>
      )}
    </div>
  );
};
