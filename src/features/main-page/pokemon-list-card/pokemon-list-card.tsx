import { Component, type JSX } from 'react';
import type {
  CustomComponentProps,
  PokemonListResponseResult,
  PokemonDetails,
} from '../../../shared/models';
import { apiService } from '../../../shared/services/api/api-service';
import pokeballImage from '../../../assets/pokeball.png';
import './pokemon-list-card.css';

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
  constructor(props: PokemonCardProps) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount(): void {
    this.fetchPokemonDetails();
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
      pokeballImage
    );
  }

  private renderSuccessCard(): JSX.Element {
    const { details } = this.state;
    if (!details) return <></>;

    return (
      <div className="pokemon-card">
        <h3>{details.name}</h3>
        <img
          src={this.getPokemonImageUrl()}
          alt={details.name || 'pokemon name'}
        />
        <p>
          Types:{' '}
          {details.types && details.types.length > 0
            ? details.types.map((type) => type.type.name).join(', ')
            : 'Unknown type'}
        </p>
      </div>
    );
  }

  private renderErrorCard(): JSX.Element {
    return (
      <div className="pokemon-card pokemon-card--error">
        <h3>{this.props.pokemonBaseInfo.name}</h3>
        <p>Failed to load details: {this.state.error}</p>
      </div>
    );
  }

  private renderLoadingCard(): JSX.Element {
    return (
      <div className="pokemon-card pokemon-card--loading">
        <p>Loading {this.props.pokemonBaseInfo.name}...</p>
      </div>
    );
  }

  render(): JSX.Element {
    const { loading, error } = this.state;

    if (loading) {
      return this.renderLoadingCard();
    }

    if (error) {
      return this.renderErrorCard();
    }

    return this.renderSuccessCard();
  }
}
