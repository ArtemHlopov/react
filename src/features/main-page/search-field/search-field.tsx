'use client';
import { useState } from 'react';
import type { FilterProps } from '../../../shared/models';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { Button } from '../../../shared/components/button/button';
import './search-field.css';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';
import { useContext } from 'react';
import { usePathname, useRouter } from '../../../i18n/navigation';
import { useSearchParams } from 'next/navigation';

export const SearchField = ({ filter }: FilterProps) => {
  const inputPlaceholder = 'Search pokemon by name';
  const [currentfilter, setCurrentFilter] = useState<string>(filter || '');
  const { isDarkTheme } = useContext(DarkThemeContext);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleInputChange = (value: unknown): void => {
    const stringValue = String(value);
    setCurrentFilter(stringValue);

    if (!stringValue) {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete('query');
      params.set('page', '1');
      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  const handleSearchClick = (): void => {
    const trimmed = currentfilter.trim();
    setCurrentFilter(trimmed);

    const params = new URLSearchParams(searchParams?.toString());
    if (trimmed) {
      params.set('query', trimmed);
    } else {
      params.delete('query');
    }
    params.set('page', '1');
    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="search_field_wrapper">
      <TextInput
        value={currentfilter}
        placeholder={inputPlaceholder}
        onChange={handleInputChange}
        className={` ${isDarkTheme ? 'text_input__dark' : ''}`}
      />
      <Button
        onClick={handleSearchClick}
        text="Search"
        className={` ${isDarkTheme ? 'button__dark' : ''}`}
      />
    </div>
  );
};
