'use client';
import { useCallback, useContext } from 'react';
import pokeballImage from '../../../assets/pokeball.png';
import './details-panel.css';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';
import { getApiErrorMessage } from '../../../shared/helpers/getApiErrorMessage';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '../../../i18n/navigation';
import Image from 'next/image';
import type { PokemonDetails } from '../../../shared/models';

interface DetailsPanelProps {
  data: PokemonDetails | null;
  errorMsg?: string;
}

export const DetailsPanel = ({ data, errorMsg }: DetailsPanelProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDarkTheme } = useContext(DarkThemeContext);

  const getPokemonImageUrl = useCallback(() => {
    return (
      data?.sprites?.other?.['official-artwork']?.front_default ||
      data?.sprites?.other?.home?.front_default ||
      data?.sprites?.other?.dream_world?.front_default ||
      pokeballImage
    );
  }, [data]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams?.toString());
    router.push(`/?${params.toString()}`);
  };

  return (
    <div
      className={`details_panel ${isDarkTheme ? 'details_panel__dark' : ''}  `}
    >
      <button className="details_button" onClick={handleClose}>
        X
      </button>

      {errorMsg ? (
        <h2>{errorMsg}</h2>
      ) : data ? (
        <div>
          <h2>{data.name}</h2>
          <div className="details_image_wrapper">
            <Image
              src={getPokemonImageUrl()}
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p>Height: {data.height}</p>
          <p>Weight: {data.weight}</p>
          <p>
            Types: {(data.types || []).map((type) => type.type.name).join(', ')}
          </p>
        </div>
      ) : (
        <h2>No details found.</h2>
      )}
    </div>
  );
};
