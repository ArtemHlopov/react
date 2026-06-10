import { useCallback, useEffect } from 'react';
import type { Callback } from '../models/common';

const MOUSE_UP = 'mouseup';

export const useOutsideClick = (
  handleClose: Callback,
  ref: React.RefObject<HTMLElement | null>
) => {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (
        ref?.current?.contains &&
        !ref.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    },
    [handleClose, ref]
  );

  useEffect(() => {
    document.addEventListener(MOUSE_UP, handleClick);
    return () => document.removeEventListener(MOUSE_UP, handleClick);
  }, [handleClick]);
};
