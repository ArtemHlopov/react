'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export const usePagination = (defaultPage = 1) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const pageParam = searchParams?.get('page');
  const currentPage = Number(pageParam) || defaultPage;

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(page));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return { currentPage, setPage };
};
