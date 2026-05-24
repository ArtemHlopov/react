import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import { ColumnLayout } from './column-layout';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';

describe('Layout', () => {
  it('shows the default content when children are not passed', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <ColumnLayout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No content')).toBeInTheDocument();
  });

  it('renders the provided children inside the layout', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <ColumnLayout>
            <div>Test</div>
          </ColumnLayout>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
