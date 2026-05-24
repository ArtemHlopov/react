import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { PokemonDetails } from '../../../shared/models';
import { apiService } from '../../../shared/services/api/api-service';
import pokeballImage from '../../../assets/pokeball.png';
import './details-panel.css';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';

export const DetailsPanel = () => {
  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkTheme } = useContext(DarkThemeContext);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!name) {
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getPokemonDetails(
          apiService.getPokemonLink(name)
        );
        setDetails(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Troubles loading pokempon'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [name]);

  const getPokemonImageUrl = useCallback(() => {
    return (
      details?.sprites?.other?.['official-artwork']?.front_default ||
      details?.sprites?.other?.home?.front_default ||
      details?.sprites?.other?.dream_world?.front_default ||
      pokeballImage
    );
  }, [details]);

  const handleClose = () => {
    navigate(`/?${searchParams.toString()}`);
  };

  return (
    <div
      className={`details_panel ${isDarkTheme ? 'details_panel__dark' : ''}  `}
    >
      <button className="details_button" onClick={handleClose}>
        X
      </button>

      {loading ? (
        <div>
          <img className="spin" src={pokeballImage} alt="Loading" width="50" />
          <p>Loading details...</p>
        </div>
      ) : error ? (
        <h2>{error}</h2>
      ) : details ? (
        <div>
          <h2>{details.name}</h2>
          <div className="details_image_wrapper">
            <img src={getPokemonImageUrl()} alt={details.name} />
          </div>
          <p>Height: {details.height}</p>
          <p>Weight: {details.weight}</p>
          <p>
            Types:{' '}
            {(details.types || []).map((type) => type.type.name).join(', ')}
          </p>
        </div>
      ) : (
        <h2>No details found.</h2>
      )}
    </div>
  );
};
