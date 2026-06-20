'use client';
import { useId, type ChangeEvent } from 'react';
import type { Callback, CustomComponentProps } from '../../models';

interface TextInputProps extends CustomComponentProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  onChange?: Callback;
}

export const TextInput = ({
  id,
  name = 'input-text-name',
  value,
  className,
  placeholder = 'Enter value',
  onChange,
}: TextInputProps) => {
  const componentId = useId();
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void =>
    onChange?.(event.target.value);

  return (
    <div className="input_wrapper">
      <input
        id={id || componentId}
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        className={className}
        onChange={handleChange}
      />
    </div>
  );
};
