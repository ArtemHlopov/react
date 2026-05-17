import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';

const { renderSpy, createRootSpy, mockRouter } = vi.hoisted(() => {
  const renderSpy = vi.fn();
  const createRootSpy = vi.fn(() => ({
    render: renderSpy,
  }));

  return {
    renderSpy,
    createRootSpy,
    mockRouter: {
      subscribe: vi.fn(),
      navigate: vi.fn(),
      createHref: vi.fn(),
      encodeLocation: vi.fn(),
      getFetcher: vi.fn(),
      deleteFetcher: vi.fn(),
      dispose: vi.fn(),
      fetch: vi.fn(),
      revalidate: vi.fn(),
      state: {},
      routes: [],
      future: {},
      basename: '/',
    },
  };
});

vi.mock('react-dom/client', () => ({
  createRoot: createRootSpy,
}));

vi.mock('./features/router/router', () => ({
  router: mockRouter,
}));

describe('main.tsx', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    renderSpy.mockClear();
    createRootSpy.mockClear();
    vi.resetModules();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('creates a React root and renders RouterProvider inside StrictMode', async () => {
    await import('./main.tsx');

    expect(createRootSpy).toHaveBeenCalledWith(
      document.getElementById('root')
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);

    const [renderedTree] = renderSpy.mock.calls[0];
    expect(renderedTree.type).toBe(StrictMode);
    expect(renderedTree.props.children.type).toBe(RouterProvider);
    expect(renderedTree.props.children.props.router).toBe(mockRouter);
  });
});
