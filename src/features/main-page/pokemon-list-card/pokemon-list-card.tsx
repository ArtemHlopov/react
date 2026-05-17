import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CustomComponentProps,
  PokemonListResponseResult,
  PokemonDetails,
} from '../../../shared/models';
import { apiService } from '../../../shared/services/api/api-service';
import pokeballCardLoader from '../../../assets/pokeball.png';
import './pokemon-list-card.css';
import { capitalizeStr } from '../../../shared/helpers/capitalizeStr';

interface PokemonCardProps extends CustomComponentProps {
  pokemonBaseInfo: PokemonListResponseResult;
}

export const PokemonListCard = ({ pokemonBaseInfo }: PokemonCardProps) => {
  const unknownName = 'Unknown pokemon';

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  const fetchPokemonDetails = useCallback(async (): Promise<void> => {
    try {
      const details = await apiService.getPokemonDetails(pokemonBaseInfo.url);
      setDetails(details);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [pokemonBaseInfo]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPokemonDetails();
    };
    fetchData();
  }, [fetchPokemonDetails]);

  const getPokemonImageUrl = useCallback(() => {
    return (
      details?.sprites?.other?.['official-artwork']?.front_default ||
      details?.sprites?.other?.home?.front_default ||
      details?.sprites?.other?.dream_world?.front_default ||
      pokeballCardLoader
    );
  }, [details]);

  const imageSrc = useMemo(() => {
    return loading ? pokeballCardLoader : getPokemonImageUrl();
  }, [loading, getPokemonImageUrl]);
  const description =
    details?.types && details?.types.length > 0
      ? details?.types.map((type) => type.type.name).join(', ')
      : 'Unknown type';
  const pokemonName = details?.name
    ? capitalizeStr(details?.name)
    : unknownName;

  return (
    <div className="pokemon_card">
      <h3>{pokemonName}</h3>
      <div className="image_wrapper">
        {' '}
        <img
          className={`pokemon_card_image ${loading ? 'pulse' : ''}`}
          src={imageSrc}
          alt={pokemonName}
        />
      </div>

      <p className="pokemon_card_description">
        {loading
          ? 'Loading...'
          : error
            ? `Error: ${error}`
            : `Types: ${description}`}
      </p>
    </div>
  );
};
