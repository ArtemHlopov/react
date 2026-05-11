import { it, expect, describe, vi } from 'vitest';
import { TextInput } from './text-input';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Text input', () => {
  it('input should be in document', () => {
    render(<TextInput></TextInput>);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should accept right props', () => {
    render(
      <TextInput
        id="test_id"
        name="test_name"
        placeholder="test_plh"
        value="test_val"
        className="test_class"
      ></TextInput>
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test_id');
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'test_name');
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'test_plh'
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('class', 'test_class');
    expect(screen.getByRole('textbox')).toHaveAttribute('value', 'test_val');
  });

  it('should have default props', () => {
    render(<TextInput></TextInput>);

    expect(
      screen.getByRole('textbox').getAttribute('id')?.startsWith('input-text-')
    ).toBeTruthy();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'name',
      'input-text-name'
    );
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Enter value'
    );
  });

  it('should trigger handler on input with right args', async () => {
    const changeFn = vi.fn();
    const user = userEvent.setup();

    render(<TextInput onChange={changeFn}></TextInput>);
    await user.type(screen.getByRole('textbox'), 'text');

    expect(changeFn).toHaveBeenCalledTimes(4);
    expect(changeFn).toHaveBeenLastCalledWith('text');
  });

  it('dont throw error without callback in props', async () => {
    const user = userEvent.setup();

    render(<TextInput></TextInput>);

    await expect(
      user.type(screen.getByRole('textbox'), 'Test')
    ).resolves.not.toThrow();
  });
});
