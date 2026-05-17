import { useState } from 'react';
import pokedexImage from '../../../assets/Pokédex_logo.png';
import './header.css';
import { Button } from '../button/button';
import { NavLink } from 'react-router-dom';

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
      <div className="header_nav">
        <img className="header_logo" src={pokedexImage} alt="pokedex" />
        <nav>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'header_link active' : 'header_link'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'header_link active' : 'header_link'
            }
          >
            About
          </NavLink>
          <NavLink
            to="/404"
            className={({ isActive }) =>
              isActive ? 'header_link active' : 'header_link'
            }
          >
            404
          </NavLink>
        </nav>
      </div>
      <Button text="Test error" onClick={handleTestErrorClick} />
    </div>
  );
};
