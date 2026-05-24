import { useState } from 'react';
import type { FilterProps } from '../../../shared/models';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { Button } from '../../../shared/components/button/button';
import './search-field.css';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';
import { useContext } from 'react';

export const SearchField = ({ filter, onFilterChange }: FilterProps) => {
  const inputPlaceholder = 'Search pokemon by name';
  const [currentfilter, setCurrentFilter] = useState<string>(filter || '');
  const { isDarkTheme } = useContext(DarkThemeContext);

  const handleInputChange = (value: unknown): void => {
    setCurrentFilter(String(value));
  };

  const handleSearchClick = (): void => {
    if (onFilterChange) {
      const trimmed = currentfilter.trim();

      setCurrentFilter(trimmed);
      onFilterChange(trimmed);
    }
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
