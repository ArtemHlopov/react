import { useCallback, useContext } from 'react';
import { useGetPokemonDetailsQuery } from '../../../shared/services/api/api-service';
import pokeballImage from '../../../assets/pokeball.png';
import './details-panel.css';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';
import { getApiErrorMessage } from '../../../shared/helpers/getApiErrorMessage';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export const DetailsPanel = () => {
  const params = useParams();
  const name = params?.name as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const normalizedName = (name ?? '').toLowerCase();

  const { data, isFetching, error } = useGetPokemonDetailsQuery(
    normalizedName,
    {
      skip: !name,
    }
  );
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

      {isFetching ? (
        <div>
          <img className="spin" src={pokeballImage} alt="Loading" width="50" />
          <p>Loading details...</p>
        </div>
      ) : error ? (
        <h2>{getApiErrorMessage(error)}</h2>
      ) : data ? (
        <div>
          <h2>{data.name}</h2>
          <div className="details_image_wrapper">
            <img src={getPokemonImageUrl()} alt={data.name} />
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
