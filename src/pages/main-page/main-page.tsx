import { useState, useContext } from 'react';
import { usePagination } from '../../shared/hooks/use-pagination';
import type { FilterProps, PokemonListResponse } from '../../shared/models';
import { SearchField } from '../../features/main-page/search-field/search-field';
import { ResultList } from '../../features/main-page/result-list/result-list';
import { LS_FILTER_KEY } from '../../shared/constants';
import {
  getPokemonDetailsUrl,
  paginationService,
  useGetPokemonDetailsQuery,
  useGetPokemonListQuery,
} from '../../shared/services/api/api-service';
import { ResultListPagination } from '../../features/main-page/result-list-pagination/result-list-pagination';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import pokeballImage from '../../assets/pokeball.png';
import './main-page.css';
import { Outlet } from 'react-router-dom';
import { DarkThemeContext } from '../../shared/context/appThemeContext';
import { getApiErrorMessage } from '../../shared/helpers/getApiErrorMessage';

export const MainPage = ({ filter }: FilterProps) => {
  const { getLsValue, setLsValue } = useLocalStorage(LS_FILTER_KEY);
  const [currentFilter, setCurrentFilter] = useState<string>(
    () => filter || getLsValue()
  );
  const { currentPage, setPage } = usePagination();
  const [limit, setLimit] = useState<number>(paginationService.limit);
  const normalizedSearchTerm = currentFilter.toLowerCase();
  const {
    data: listData,
    isFetching,
    error,
  } = useGetPokemonListQuery(
    { limit, offset: (currentPage - 1) * limit },
    { skip: !!currentFilter }
  );
  const {
    data: searchedPokemon,
    isFetching: isSearchFetching,
    error: searchError,
  } = useGetPokemonDetailsQuery(normalizedSearchTerm, {
    skip: !normalizedSearchTerm,
  });

  const searchedPokemonName = searchedPokemon?.name || normalizedSearchTerm;
  const searchedPokemonData: PokemonListResponse | null = searchedPokemon
    ? {
        next: null,
        previous: null,
        count: 1,
        results: [
          {
            name: searchedPokemonName,
            url: getPokemonDetailsUrl(searchedPokemonName),
          },
        ],
      }
    : null;
  const data = normalizedSearchTerm ? searchedPokemonData : listData;
  const errorMessage = getApiErrorMessage(
    normalizedSearchTerm ? searchError : error
  );
  const isLoading = isFetching || isSearchFetching;

  const { isDarkTheme } = useContext(DarkThemeContext);

  const handleNewFilter = (value: unknown): void => {
    const stringValue = String(value).trim();
    if (stringValue !== currentFilter) {
      setLsValue(stringValue);
      setCurrentFilter(stringValue);
      setPage(1);
    }
  };

  const handleChangePage = (isNextPage: unknown): void => {
    if (isNextPage) {
      setPage(currentPage + 1);
    } else {
      setPage(Math.max(1, currentPage - 1));
    }
  };

  const handleLimitChange = (value: unknown): void => {
    if (value && typeof value === 'number') {
      paginationService.setLimitValue(value);
      setLimit(value);
      setPage(1);
    }
  };

  return (
    <div className="main_page_wrapper">
      {isLoading ? (
        <div className="main_page_loader_overlay">
          <img
            className="main_page_loader_image spin"
            src={pokeballImage}
            alt="Loading pokemon"
          />
        </div>
      ) : null}
      <div
        className={`main_page_left_column ${isDarkTheme ? 'main_page_left_column__dark' : ''}`}
      >
        <SearchField filter={currentFilter} onFilterChange={handleNewFilter} />
        <ResultList list={data?.results || []} errorMsg={errorMessage} />

        {!isLoading && data && (
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
      <Outlet />
    </div>
  );
};
