import { useState } from 'react';
import pokedexImage from '../../../assets/Pokédex_logo.png';
import './header.css';
import { Button } from '../button/button';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { DarkThemeContext } from '../../context/appThemeContext';

export const Header = () => {
  const [error, setError] = useState(false);
  const { isDarkTheme, toggleTheme } = useContext(DarkThemeContext);
  const handleTestErrorClick = (): void => {
    setError(true);
  };
  if (error) {
    throw new Error('Test application error');
  }

  return (
    <div
      className={`header_wrapper ${isDarkTheme ? 'header_wrapper__dark' : ''}`}
    >
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
      <div className="header_actions">
        <Button
          className="rounded_button"
          text="Test error"
          onClick={handleTestErrorClick}
        />
        <Button
          className={`rounded_button ${isDarkTheme ? 'theme_button__dark' : ''}`}
          text={isDarkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
          onClick={toggleTheme}
        />
      </div>
    </div>
  );
};
