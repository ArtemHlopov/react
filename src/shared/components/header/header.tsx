'use client';
import { useState } from 'react';
import pokedexImage from '../../../assets/Pokédex_logo.png';
import './header.css';
import { Button } from '../button/button';
import { useContext } from 'react';
import { DarkThemeContext } from '../../context/appThemeContext';
import { pokemonApi } from '../../services/api/api-service';
import { useAppDispatch } from '../../../store/hooks';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../navigation/navigation';
import Image from 'next/image';

export const Header = () => {
  const [error, setError] = useState(false);
  const { isDarkTheme, toggleTheme } = useContext(DarkThemeContext);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const t = useTranslations('header');

  const handleTestErrorClick = (): void => {
    setError(true);
  };

  if (error) {
    throw new Error('Test application error');
  }

  const handleRefreshData = (): void => {
    dispatch(pokemonApi.util.invalidateTags(['PokemonList', 'PokemonDetails']));
  };

  return (
    <div
      className={`header_wrapper ${isDarkTheme ? 'header_wrapper__dark' : ''}`}
    >
      <div className="header_nav">
        <Image className="header_logo" src={pokedexImage} alt="pokedex" />
        <nav>
          <Link
            href="/"
            className={pathname === '/' ? 'header_link active' : 'header_link'}
          >
            {t('home')}
          </Link>
          <Link
            href="/about"
            className={
              pathname === '/about' ? 'header_link active' : 'header_link'
            }
          >
            {t('about')}
          </Link>

          <Link
            href="/404"
            className={
              pathname === '/404' ? 'header_link active' : 'header_link'
            }
          >
            {t('404')}
          </Link>
        </nav>
      </div>
      <div className="header_actions">
        <Button
          className="rounded_button"
          text={t('testError')}
          onClick={handleTestErrorClick}
        />
        <Button
          className="rounded_button"
          text={t('refresh')}
          onClick={handleRefreshData}
        />
        <Button
          className={`rounded_button ${isDarkTheme ? 'theme_button__dark' : ''}`}
          text={isDarkTheme ? `${t('lightMode')}` : `${t('darkMode')}`}
          onClick={toggleTheme}
        />
        <LanguageSwitcher />
      </div>
    </div>
  );
};
