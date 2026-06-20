'use client';
import { useContext, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  clearSelectedPokemons,
  selectedPokemonsSelector,
} from '../../../store/selectedPokemonSlice';
import { DarkThemeContext } from '../../context/appThemeContext';
import './flayout.css';

export const Flayout = () => {
  const dispatch = useAppDispatch();
  const selectedPokemons = useAppSelector(selectedPokemonsSelector);
  const { isDarkTheme } = useContext(DarkThemeContext);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleUnselectAll = () => {
    dispatch(clearSelectedPokemons());
  };

  const handleDownloadCSV = async () => {
    if (selectedPokemons.length === 0) {
      return;
    }

    setIsDownloading(true);

    try {
      const csvHeaders = ['Name', 'Details URL'];
      const csvRows = selectedPokemons.map((pokemon) => {
        const name = pokemon.name || 'Unknown pokemon';
        const url = pokemon.url || 'no details url';
        return `"${name}","${url}"`;
      });

      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedPokemons.length}_items.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Downloading failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  if (selectedPokemons.length === 0) {
    return null;
  }

  return (
    <div
      className={`flyout_container ${isDarkTheme ? 'flyout_container__dark' : ''}`}
    >
      <div className="flyout_content">
        <span className="flyout_info">
          Selected: <strong>{selectedPokemons.length}</strong>{' '}
          {selectedPokemons.length === 1 ? 'item' : 'items'}
        </span>
        <div className="flyout_buttons">
          <button
            className={`rounded_button ${isDownloading ? 'rounded_button__dark' : ''}`}
            onClick={handleUnselectAll}
            disabled={isDownloading}
          >
            Unselect all
          </button>
          <button
            className={`rounded_button ${isDownloading ? 'rounded_button__dark' : ''}`}
            onClick={handleDownloadCSV}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};
