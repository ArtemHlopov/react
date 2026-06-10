import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEscClick } from './escClick';

describe('useEscClick', () => {
  it('calls handleClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useEscClick(handleClose, ref));

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call handleClose on other keys', () => {
    const handleClose = vi.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useEscClick(handleClose, ref));

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('removes the listener after unmount', () => {
    const handleClose = vi.fn();
    const ref = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useEscClick(handleClose, ref));
    unmount();

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(handleClose).not.toHaveBeenCalled();
  });
});
