import { useRef } from 'react';
import type { Callback } from '../../models/common';
import './modal.css';
import { useOutsideClick } from '../../hooks/outsideclic.l';
import { useEscClick } from '../../hooks/escClick';

import UncontrolledForm from './uncontrolled-form/uncontrolled-form';
import ControlledForm from './controlled-form/controlled-form';

interface ModalProps {
  onClose: Callback;
}

function Modal({ onClose }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(onClose, ref);
  useEscClick(onClose, ref);

  return (
    <>
      <div className="modal_wrapper">
        <div className="form_wrapper" ref={ref}>
          <ControlledForm onClose={onClose} />
          <UncontrolledForm onClose={onClose} />
          <button className="close_btn" type="button" onClick={onClose}>
            X
          </button>
        </div>
      </div>
    </>
  );
}

export default Modal;
