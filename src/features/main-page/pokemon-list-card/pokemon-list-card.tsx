import { Component, type JSX } from 'react';
import type {
  CustomComponentProps,
  PokemonListResponseResult,
  PokemonDetails,
} from '../../../shared/models';
import { apiService } from '../../../shared/services/api/api-service';
import pokeballCardLoader from '../../../assets/pokeball.png';
import './pokemon-list-card.css';
import { capitalizeStr } from '../../../shared/helpers';

interface PokemonCardProps extends CustomComponentProps {
  pokemonBaseInfo: PokemonListResponseResult;
}

interface PokemonCardState {
  details?: PokemonDetails;
  loading: boolean;
  error?: string;
}

export class PokemonListCard extends Component<
  PokemonCardProps,
  PokemonCardState
> {
  protected readonly unknownName = 'Unknown pokemon';
  private readonly minLoadingDuration = 3000;
  private timeout: number | null = null;

  constructor(props: PokemonCardProps) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount(): void {
    this.timeout = setTimeout(() => {
      this.fetchPokemonDetails();
    }, this.minLoadingDuration);
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private async fetchPokemonDetails(): Promise<void> {
    try {
      const details = await apiService.getPokemonDetails(
        this.props.pokemonBaseInfo.url
      );
      this.setState({
        details,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  }

  private getPokemonImageUrl(): string {
    const { details } = this.state;
    return (
      details?.sprites?.other?.['official-artwork']?.front_default ||
      details?.sprites?.other?.home?.front_default ||
      details?.sprites?.other?.dream_world?.front_default ||
      pokeballCardLoader
    );
  }

  render(): JSX.Element {
    const { loading, error, details } = this.state;
    const imageSrc = loading ? pokeballCardLoader : this.getPokemonImageUrl();
    const description =
      details?.types && details?.types.length > 0
        ? details?.types.map((type) => type.type.name).join(', ')
        : 'Unknown type';
    const pokemonName = details?.name
      ? capitalizeStr(details?.name)
      : this.unknownName;

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
  }
}
