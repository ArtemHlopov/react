import { useCallback, useEffect } from 'react';
import type { Callback } from '../models/common';

const KEY_NAME_ESC = 'Escape';
const KEY_EVENT_TYPE = 'keyup';

export const useEscClick = (
  handleClose: Callback,
  ref: React.RefObject<HTMLElement | null>
) => {
  const handleClick = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KEY_NAME_ESC && ref?.current) {
        handleClose();
      }
    },
    [handleClose, ref]
  );

  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleClick);
    return () => document.removeEventListener(KEY_EVENT_TYPE, handleClick);
  }, [handleClick]);
};
