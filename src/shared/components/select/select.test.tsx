import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './select';

const options = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '30', value: 30 },
];

describe('Select', () => {
  it('renders all options and supports custom props', () => {
    render(<Select id="page-size" options={options} disabled={true} />);

    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'page-size');
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('calls onSelectChange with the selected value', async () => {
    const user = userEvent.setup();
    const onSelectChange = vi.fn();

    render(<Select options={options} onSelectChange={onSelectChange} />);

    await user.selectOptions(screen.getByRole('combobox'), '20');

    expect(onSelectChange).toHaveBeenCalledTimes(1);
    expect(onSelectChange).toHaveBeenCalledWith('20');
  });

  it('does not throw when no callback is provided', async () => {
    const user = userEvent.setup();

    render(<Select options={options} />);

    await expect(
      user.selectOptions(screen.getByRole('combobox'), '30')
    ).resolves.not.toThrow();
  });
});
