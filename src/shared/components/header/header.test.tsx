import { it, expect, describe } from 'vitest';
import { Header } from './header';
import { ErrorBoundary } from '../error-boundary/error-boundary';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Header', () => {
  it('should have image', () => {
    render(<Header></Header>);
    expect(screen.getByRole('img', { name: 'pokedex' })).toBeInTheDocument();
  });

  it('should have button', () => {
    render(<Header></Header>);
    expect(
      screen.getByRole('button', { name: 'Test error' })
    ).toBeInTheDocument();
  });

  it('refresh state and throw error', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});
