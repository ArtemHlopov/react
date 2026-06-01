import { it, expect, describe, vi, afterEach } from 'vitest';
import { Header } from './header';
import { ErrorBoundary } from '../error-boundary/error-boundary';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../test/test-utils';
import { pokemonApi } from '../../services/api/api-service';

const renderHeader = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={['/']}>
      <Header />
    </MemoryRouter>
  );

describe('Header', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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
    expect(
      screen.getByRole('button', { name: 'Refresh data' })
    ).toBeInTheDocument();
  });

  it('invalidates RTK Query caches when refresh data is clicked', async () => {
    const user = userEvent.setup();
    const invalidateSpy = vi.spyOn(pokemonApi.util, 'invalidateTags');

    renderHeader();

    await user.click(screen.getByRole('button', { name: 'Refresh data' }));

    expect(invalidateSpy).toHaveBeenCalledWith([
      'PokemonList',
      'PokemonDetails',
    ]);
  });

  it('refreshes state and throws into the error boundary', async () => {
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    renderWithProviders(
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
