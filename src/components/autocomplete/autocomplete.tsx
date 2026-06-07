import { forwardRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { countriesSelector } from '../../store/countries-slice';
import { useAppSelector } from '../../store/hooks';
import './autocomplete.css';

interface AutocompleteProps {
  id: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  name?: string;
  placeholder?: string;
}

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ id, value, defaultValue, onChange, placeholder, name }, ref) => {
    const isControlled = value !== undefined;
    const { countries: allCountries } = useAppSelector(countriesSelector);
    const validCountries = allCountries.filter(Boolean);

    const [query, setQuery] = useState(defaultValue ?? '');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    const inputValue = isControlled ? value : query;

    const handleFocus = () => {
      setSuggestions(validCountries);
      setOpen(true);
    };

    const handleBlur = () => {
      setTimeout(() => setOpen(false), 150);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      if (!isControlled) setQuery(val);

      setSuggestions(
        val.trim()
          ? validCountries.filter((c) =>
              c.toLowerCase().includes(val.toLowerCase())
            )
          : validCountries
      );

      onChange?.(e);
    };

    const handleSelect = (item: string) => {
      if (!isControlled) setQuery(item);
      setOpen(false);

      onChange?.({
        target: { value: item, name: name ?? '' },
      } as ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className="autocomplete_wrapper">
        <input
          ref={ref}
          id={id}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
        {open && suggestions.length > 0 && (
          <ul>
            {suggestions.map((item) => (
              <li key={item} onClick={() => handleSelect(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;
