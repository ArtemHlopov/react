'use client';
import { useId, type ChangeEvent, useContext } from 'react';
import type { Callback, CustomComponentProps } from '../../models';
import './select.css';
import { DarkThemeContext } from '../../context/appThemeContext';

interface SelectOptions {
  title: string;
  value: string | number;
}

interface SelectProps extends CustomComponentProps {
  id?: string;
  options: SelectOptions[];
  disabled?: boolean;
  onSelectChange?: Callback;
  value?: number | string;
}

export const Select = ({
  id,
  options,
  disabled = false,
  onSelectChange,
  value,
}: SelectProps) => {
  const componentId = useId();
  const { isDarkTheme } = useContext(DarkThemeContext);
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void =>
    onSelectChange?.(event.target.value);

  return (
    <div className="select_wrapper">
      <select
        id={id || componentId}
        onChange={handleChange}
        disabled={disabled}
        value={value}
        className={`${isDarkTheme ? 'select__dark' : ''}`}
      >
        {options.map((option, index) => (
          <option key={`option-${index}-key`} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
};
