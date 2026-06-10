import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Autocomplete from './autocomplete';
import { makeStore } from '../../test/renderWithStore';

function renderAutocomplete(props = {}) {
  return render(
    <Provider store={makeStore()}>
      <Autocomplete id="country" placeholder="Select country" {...props} />
    </Provider>
  );
}

describe('Autocomplete', () => {
  it('renders the input', () => {
    renderAutocomplete();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows all suggestions when focused', () => {
    renderAutocomplete();
    fireEvent.focus(screen.getByRole('textbox'));
    expect(screen.getByText('Poland')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('filters suggestions based on typed value', () => {
    renderAutocomplete();
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'pol' } });
    expect(screen.getByText('Poland')).toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
  });

  it('calls onChange when a suggestion is clicked', () => {
    const onChange = vi.fn();
    renderAutocomplete({ onChange });
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.click(screen.getByText('Poland'));
    expect(onChange).toHaveBeenCalled();
  });

  it('hides suggestions after selecting', () => {
    renderAutocomplete();
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.click(screen.getByText('Poland'));
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
  });

  it('works in uncontrolled mode (no value prop)', () => {
    renderAutocomplete({ defaultValue: 'Pol' });
    expect(screen.getByRole('textbox')).toHaveValue('Pol');
  });
});
