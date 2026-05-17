import { useEffect, useState, useCallback } from 'react';
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
  const [currentFilter, setCurrentFilter] = useState<string>(filter || '');
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getItemsList();
      setData(data);
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        setError(defaultErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getPokemonByName = useCallback(
    async (name: string): Promise<void> => {
      setLoading(true);

      if (!name.trim()) {
        await getList();
        return;
      }
      setData((prev) => ({
        next: prev?.next || null,
        previous: prev?.previous || null,
        count: prev?.count || '',
        results: [{ name, url: apiService.getPokemonLink(name) }],
      }));
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
      if (stringValue) {
        await getPokemonByName(stringValue);
      } else {
        await getList();
      }
    }
  };

  const handleChangePage = async (isNextPage: unknown): Promise<void> => {
    if (isNextPage) {
      await apiService.setOffsetValue(apiService.offset + apiService.limit);
    } else {
      const newOffset = apiService.offset - apiService.limit;
      if (newOffset >= 0) {
        await apiService.setOffsetValue(newOffset);
      }
    }
    await getList();
  };

  const handleLimitChange = async (value: unknown): Promise<void> => {
    if (value && typeof value === 'number') {
      await apiService.setOffsetValue(
        value > apiService.offset ? 0 : apiService.offset - value
      );
      await apiService.setLimitValue(value);
      await getList();
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

      <ResultListPagination
        total={data?.count || ''}
        onOffsetChange={handleChangePage}
        onLimitChange={handleLimitChange}
        next={data?.next || null}
        previous={data?.previous || null}
        disabled={!!currentFilter}
      ></ResultListPagination>
    </div>
  );
};
