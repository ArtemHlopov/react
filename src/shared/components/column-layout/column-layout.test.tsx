import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import { ColumnLayout } from './column-layout';
import { MemoryRouter } from 'react-router-dom';

describe('Layout', () => {
  it('shows the default content when children are not passed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ColumnLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('No content')).toBeInTheDocument();
  });

  it('renders the provided children inside the layout', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ColumnLayout>
          <div>Test</div>
        </ColumnLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
