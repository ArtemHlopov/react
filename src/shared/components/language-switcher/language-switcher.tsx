'use client';

import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '../../../i18n/navigation';
import { Button } from '../button/button';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getNextLocale = () => (locale === 'en' ? 'ru' : 'en');

  const handleSwitch = () => {
    const nextLocale = getNextLocale();
    const query = searchParams?.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, {
      locale: nextLocale,
    });
  };

  return (
    <Button
      className="rounded_button"
      text={getNextLocale()}
      onClick={handleSwitch}
    />
  );
};
