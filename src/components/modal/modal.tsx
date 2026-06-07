import { useRef } from 'react';
import type { Callback } from '../../models/common';
import './modal.css';
import { useOutsideClick } from '../../hooks/outsideclic.l';
import { useEscClick } from '../../hooks/escClick';

interface ModalProps {
  onClose: Callback;
}

function Modal({ onClose }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(onClose, ref);
  useEscClick(onClose, ref);
  return (
    <>
      <div className="modal_wrapper" ref={ref}>
        <h6>Modal content</h6>
        <button onClick={onClose}>Close modal</button>
      </div>
    </>
  );
}

export default Modal;
