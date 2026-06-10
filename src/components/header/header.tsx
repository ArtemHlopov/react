import { useState } from 'react';
import './header.css';
import { createPortal } from 'react-dom';
import Modal from '../modal/modal';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <header className="header">
      <button onClick={toggleModal}>Open modal</button>
      {isModalOpen &&
        createPortal(<Modal onClose={toggleModal} />, document.body)}
    </header>
  );
}

export default Header;
