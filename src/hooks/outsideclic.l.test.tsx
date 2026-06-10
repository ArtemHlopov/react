import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOutsideClick } from './outsideclic.l';

describe('useOutsideClick', () => {
  it('calls handleClose when clicking outside the element', () => {
    const handleClose = vi.fn();
    const inner = document.createElement('div');
    document.body.appendChild(inner);
    const ref = { current: inner };

    renderHook(() => useOutsideClick(handleClose, ref));

    // Click on document itself (outside the inner div)
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    document.body.removeChild(inner);
  });

  it('does not call handleClose when clicking inside the element', () => {
    const handleClose = vi.fn();
    const inner = document.createElement('div');
    document.body.appendChild(inner);
    const ref = { current: inner };

    renderHook(() => useOutsideClick(handleClose, ref));

    inner.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(handleClose).not.toHaveBeenCalled();

    document.body.removeChild(inner);
  });

  it('removes the listener after unmount', () => {
    const handleClose = vi.fn();
    const ref = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useOutsideClick(handleClose, ref));
    unmount();

    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(handleClose).not.toHaveBeenCalled();
  });
});
