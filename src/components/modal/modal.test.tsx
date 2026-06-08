import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Modal from './modal';
import { makeStore } from '../../test/renderWithStore';

function renderModal(onClose = vi.fn()) {
  return render(
    <Provider store={makeStore()}>
      <Modal onClose={onClose} />
    </Provider>
  );
}

describe('Modal', () => {
  it('renders controlled form', () => {
    renderModal();
    expect(screen.getByText('Controlled Form')).toBeInTheDocument();
  });

  it('renders uncontrolled form', () => {
    renderModal();
    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByText('X'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
