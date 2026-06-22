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
      const response = await fetch('/api/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPokemons),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedPokemons.length}_items.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

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
