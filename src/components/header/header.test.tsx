import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Header from './header';
import { makeStore } from '../../test/renderWithStore';

vi.mock('../modal/modal', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

function renderHeader() {
  return render(
    <Provider store={makeStore()}>
      <Header />
    </Provider>
  );
}

describe('Header', () => {
  it('renders the open modal button', () => {
    renderHeader();
    expect(screen.getByText('Open modal')).toBeInTheDocument();
  });

  it('opens modal when button is clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByText('Open modal'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('closes modal when onClose is called', () => {
    renderHeader();
    fireEvent.click(screen.getByText('Open modal'));
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
