'use client';
import { useActionState, useState } from 'react';
import type { FilterProps } from '../../../shared/models';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { Button } from '../../../shared/components/button/button';
import './search-field.css';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';
import { useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchAction } from './search-action';

export const SearchField = ({ filter }: FilterProps) => {
  const inputPlaceholder = 'Search pokemon by name';
  const [currentfilter, setCurrentFilter] = useState<string>(filter || '');
  const { isDarkTheme } = useContext(DarkThemeContext);
  const searchParams = useSearchParams();
  const [, action, pending] = useActionState(searchAction, null);

  const handleInputChange = (value: unknown): void => {
    const stringValue = String(value);
    setCurrentFilter(stringValue);
  };

  return (
    <form action={action} className="search_field_wrapper">
      <input
        type="hidden"
        name="limit"
        value={searchParams?.get('limit') ?? ''}
      />
      <TextInput
        name="query"
        value={currentfilter}
        placeholder={inputPlaceholder}
        onChange={handleInputChange}
        className={` ${isDarkTheme ? 'text_input__dark' : ''}`}
      />
      <Button
        type="submit"
        disabled={pending}
        text="Search"
        className={` ${isDarkTheme ? 'button__dark' : ''}`}
      />
    </form>
  );
};
