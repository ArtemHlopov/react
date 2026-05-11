import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';

const { renderSpy, createRootSpy } = vi.hoisted(() => {
  const renderSpy = vi.fn();
  const createRootSpy = vi.fn(() => ({
    render: renderSpy,
  }));

  return { renderSpy, createRootSpy };
});

vi.mock('react-dom/client', () => ({
  createRoot: createRootSpy,
}));

vi.mock('./App.tsx', () => ({
  default: function MockApp() {
    return <div>Mock App</div>;
  },
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

  it('creates a React root and renders App inside StrictMode', async () => {
    await import('./main.tsx');
    const AppModule = await import('./App.tsx');

    expect(createRootSpy).toHaveBeenCalledWith(
      document.getElementById('root')
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);

    const [renderedTree] = renderSpy.mock.calls[0];
    expect(renderedTree.type).toBe(StrictMode);
    expect(renderedTree.props.children.type).toBe(AppModule.default);
  });
});
