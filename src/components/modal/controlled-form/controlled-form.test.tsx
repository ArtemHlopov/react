import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ControlledForm from './controlled-form';
import { makeStore } from '../../../test/renderWithStore';

function renderForm(onClose = vi.fn()) {
  return render(
    <Provider store={makeStore()}>
      <ControlledForm onClose={onClose} />
    </Provider>
  );
}

describe('ControlledForm', () => {
  it('renders the form heading', () => {
    renderForm();
    expect(screen.getByText('Controlled Form')).toBeInTheDocument();
  });

  it('renders all main fields', () => {
    renderForm();
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /age/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /gender/i })).toBeInTheDocument();
  });

  it('submit button is disabled when form is empty (invalid)', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});
