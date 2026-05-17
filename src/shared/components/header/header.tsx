import { useState } from 'react';
import pokedexImage from '../../../assets/Pokédex_logo.png';
import './header.css';
import { Button } from '../button/button';

export const Header = () => {
  const [error, setError] = useState(false);
  const handleTestErrorClick = (): void => {
    setError(true);
  };
  if (error) {
    throw new Error('Test application error');
  }

  return (
    <div className="header_wrapper">
      <img className="header_logo" src={pokedexImage} alt="pokedex" />
      <Button text="Test error" onClick={handleTestErrorClick} />
    </div>
  );
};
