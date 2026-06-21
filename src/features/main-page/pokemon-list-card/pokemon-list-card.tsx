'use client';
import { useCallback, useContext, useMemo } from 'react';
import type {
  CustomComponentProps,
  PokemonListResponseResult,
} from '../../../shared/models';
import { useGetPokemonDetailsQuery } from '../../../shared/services/api/api-service';
import pokeballCardLoader from '../../../assets/pokeball.png';
import './pokemon-list-card.css';
import { capitalizeStr } from '../../../shared/helpers/capitalizeStr';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectedPokemonsSelector,
  toggleSelectedPokemon,
} from '../../../store/selectedPokemonSlice';
import { getApiErrorMessage } from '../../../shared/helpers/getApiErrorMessage';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '../../../i18n/navigation';
import Image from 'next/image';

interface PokemonCardProps extends CustomComponentProps {
  pokemonBaseInfo: PokemonListResponseResult;
}

export const PokemonListCard = ({ pokemonBaseInfo }: PokemonCardProps) => {
  const unknownName = 'Unknown pokemon';

  const { data, isFetching, error } = useGetPokemonDetailsQuery(
    pokemonBaseInfo.name
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const { isDarkTheme } = useContext(DarkThemeContext);
  const dispatch = useAppDispatch();
  const selectedPokemons = useAppSelector(selectedPokemonsSelector);

  const isPokemonSelected = selectedPokemons.find(
    (pokemon) => pokemon.name === pokemonBaseInfo.name
  );

  const handleCardClick = (): void => {
    if (!data && !searchParams) {
      return;
    }
    const params = new URLSearchParams(searchParams?.toString());
    router.push(`/details/${data?.name}?${params.toString()}`);
  };

  const handleCheckboxClick = (): void => {
    dispatch(toggleSelectedPokemon(pokemonBaseInfo));
  };

  const getPokemonImageUrl = useCallback(() => {
    return (
      data?.sprites?.other?.['official-artwork']?.front_default ||
      data?.sprites?.other?.home?.front_default ||
      data?.sprites?.other?.dream_world?.front_default ||
      pokeballCardLoader
    );
  }, [data]);

  const imageSrc = useMemo(() => {
    return isFetching ? pokeballCardLoader : getPokemonImageUrl();
  }, [isFetching, getPokemonImageUrl]);
  const description =
    data?.types && data?.types.length > 0
      ? data?.types.map((type) => type.type.name).join(', ')
      : 'Unknown type';
  const pokemonName = data?.name ? capitalizeStr(data?.name) : unknownName;

  return (
    <div
      className={`pokemon_card ${isDarkTheme ? 'pokemon_card__dark' : ''}`}
      onClick={handleCardClick}
    >
      <h3>
        <input
          type="checkbox"
          onClick={(e) => e.stopPropagation()}
          checked={!!isPokemonSelected}
          onChange={handleCheckboxClick}
        />
        <span>{pokemonName}</span>
      </h3>
      <div className="image_wrapper">
        <Image
          className={`pokemon_card_image ${isFetching ? 'pulse' : ''}`}
          src={imageSrc}
          alt={pokemonName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <p className="pokemon_card_description">
        {isFetching
          ? 'Loading...'
          : error
            ? `Error: ${getApiErrorMessage(error)}`
            : `Types: ${description}`}
      </p>
    </div>
  );
};
