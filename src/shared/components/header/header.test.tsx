import { it, expect, describe } from 'vitest';
import { Header } from './header';
import { ErrorBoundary } from '../error-boundary/error-boundary';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const renderHeader = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Header />
    </MemoryRouter>
  );

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    renderHeader();

    expect(screen.getByRole('img', { name: 'pokedex' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getByRole('link', { name: '404' })).toHaveAttribute(
      'href',
      '/404'
    );
  });

  it('renders the test error button', () => {
    renderHeader();

    expect(
      screen.getByRole('button', { name: 'Test error' })
    ).toBeInTheDocument();
  });

  it('refreshes state and throws into the error boundary', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Test error' }));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});
