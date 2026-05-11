import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchField } from './search-field';

describe('SearchField', () => {
  it('renders the search input and button with the initial filter', () => {
    render(<SearchField filter="pikachu" />);

    expect(
      screen.getByRole('textbox', { name: '' })
    ).toHaveValue('pikachu');
    expect(
      screen.getByRole('button', { name: 'Search' })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search pokemon by name')
    ).toBeInTheDocument();
  });

  it('updates the input and sends a trimmed filter on search', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<SearchField filter="" onFilterChange={onFilterChange} />);

    const textbox = screen.getByRole('textbox');
    await user.type(textbox, '  bulbasaur  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith('bulbasaur');
    expect(textbox).toHaveValue('bulbasaur');
  });

  it('does not throw when clicking search without a callback', async () => {
    const user = userEvent.setup();

    render(<SearchField filter="" />);

    await user.type(screen.getByRole('textbox'), 'eevee');

    await expect(
      user.click(screen.getByRole('button', { name: 'Search' }))
    ).resolves.not.toThrow();
  });
});
