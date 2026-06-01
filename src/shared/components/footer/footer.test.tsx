import { it, expect, describe } from 'vitest';
import { Footer } from './footer';
import { render, screen } from '@testing-library/react';

describe('Footer', () => {
  it('should show default(2026) year', () => {
    render(<Footer></Footer>);

    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('should show text from props year', () => {
    render(<Footer text="text"></Footer>);

    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
