import { useState } from 'react';
import './header.css';
import { createPortal } from 'react-dom';
import Modal from '../modal/modal';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <>
      <button onClick={toggleModal}>Open modal</button>
      <h6>header</h6>
      {isModalOpen &&
        createPortal(<Modal onClose={toggleModal}></Modal>, document.body)}
    </>
  );
}

export default Header;
