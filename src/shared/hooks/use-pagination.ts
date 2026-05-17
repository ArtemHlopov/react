import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePagination = (defaultPage = 1) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');

  useEffect(() => {
    if (!pageParam) {
      setSearchParams(
        (prev) => {
          prev.set('page', String(defaultPage));
          return prev;
        },
        { replace: true }
      );
    }
  }, [pageParam, setSearchParams, defaultPage]);

  const currentPage = Number(pageParam) || defaultPage;

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(page));
      return prev;
    });
  };

  return { currentPage, setPage };
};
