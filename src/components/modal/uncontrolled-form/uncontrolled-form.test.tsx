import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import UncontrolledForm from './uncontrolled-form';
import { makeStore } from '../../../test/renderWithStore';

function renderForm(onClose = vi.fn()) {
  return render(
    <Provider store={makeStore()}>
      <UncontrolledForm onClose={onClose} />
    </Provider>
  );
}

describe('UncontrolledForm', () => {
  it('renders the form heading', () => {
    renderForm();
    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows name validation error when submitting empty form', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText('First letter must be uppercase')).toBeInTheDocument();
    });
  });

  it('shows email validation error when submitting empty form', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText("Email isnt valid")).toBeInTheDocument();
    });
  });

  it('does not call onClose when form is invalid', async () => {
    const onClose = vi.fn();
    renderForm(onClose);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText('First letter must be uppercase')).toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
