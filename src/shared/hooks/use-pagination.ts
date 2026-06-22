'use client';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '../../i18n/navigation';
import { DEFAULT_LIMIT } from '../constants';

export const usePagination = (defaultPage = 1) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const pageParam = searchParams?.get('page');
  const currentPage = Number(pageParam) || defaultPage;
  const currentLimit = Number(searchParams?.get('limit') || DEFAULT_LIMIT);

  const buildParams = (overrides: Record<string, string>) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(overrides).forEach(([key, value]) => params.set(key, value));
    return params.toString();
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(page));
    params.set('limit', `${currentLimit}`);
    router.replace(
      `${pathname}?${buildParams({ page: String(page), limit: String(currentLimit) })}`
    );
  };

  const setLimit = (limit: number) => {
    router.replace(
      `${pathname}?${buildParams({ limit: String(limit), page: '1' })}`
    );
  };

  return { currentPage, setPage, currentLimit, setLimit };
};
