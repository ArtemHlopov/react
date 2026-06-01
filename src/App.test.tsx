import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const { columnLayoutSpy, outletSpy, shouldThrow } = vi.hoisted(() => ({
  columnLayoutSpy: vi.fn(),
  outletSpy: vi.fn(),
  shouldThrow: { value: false },
}));

vi.mock('./shared/components/column-layout/column-layout', () => ({
  ColumnLayout: ({ children }: { children: React.ReactNode }) => {
    columnLayoutSpy(children);

    if (shouldThrow.value) {
      throw new Error('Layout failed');
    }

    return <div data-testid="layout">{children}</div>;
  },
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    Outlet: () => {
      outletSpy();
      return <div>Outlet content</div>;
    },
  };
});

describe('App', () => {
  beforeEach(() => {
    columnLayoutSpy.mockClear();
    outletSpy.mockClear();
    shouldThrow.value = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the layout with the routed content inside the error boundary', () => {
    render(<App />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('Outlet content')).toBeInTheDocument();
    expect(columnLayoutSpy).toHaveBeenCalledTimes(1);
    expect(outletSpy).toHaveBeenCalledTimes(1);
  });

  it('shows the fallback when the wrapped tree throws', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    shouldThrow.value = true;

    render(<App />);

    expect(
      screen.getByText('Something went wrong. Try to reload the page.')
    ).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
