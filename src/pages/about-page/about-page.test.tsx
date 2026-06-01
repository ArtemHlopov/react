import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from './about-page';

describe('AboutPage', () => {
  it('renders the page text and the home link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText('App where you can find your pokemon.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('renders the rs school link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');

    expect(links[1]).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(links[1]).toHaveAttribute('target', '_blank');
  });
});
