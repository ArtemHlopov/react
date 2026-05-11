import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { LS_FILTER_KEY } from './shared/constants';

const { mainPageSpy } = vi.hoisted(() => ({
  mainPageSpy: vi.fn(),
}));

vi.mock('./pages/main-page/main-page', () => ({
  MainPage: ({ filter }: { filter: string }) => {
    mainPageSpy(filter);
    if (filter === 'throw-error') {
      throw new Error('Main page failed');
    }

    return <div>Main page filter: {filter}</div>;
  },
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    mainPageSpy.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes the saved filter from localStorage to MainPage', () => {
    localStorage.setItem(LS_FILTER_KEY, 'pikachu');

    render(<App />);

    expect(screen.getByText('Main page filter: pikachu')).toBeInTheDocument();
    expect(mainPageSpy).toHaveBeenCalledWith('pikachu');
  });

  it('shows the error boundary fallback when MainPage throws', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    localStorage.setItem(LS_FILTER_KEY, 'throw-error');

    render(<App />);

    expect(
      screen.getByText('Something went wrong. Try to reload the page.')
    ).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
