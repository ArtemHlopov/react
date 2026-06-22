'use client';
import { useId, type MouseEvent } from 'react';
import type { Callback, CustomComponentProps } from '../../models';

interface ButtonProps extends CustomComponentProps {
  id?: string;
  text?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
  disabled?: boolean;
  onClick?: Callback;
}

export const Button = ({
  id,
  text = 'Click',
  type = 'button',
  className,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const componentId = useId();
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <div className="button_wrapper">
      <button
        type={type}
        id={id || componentId}
        className={className}
        onClick={handleClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};
