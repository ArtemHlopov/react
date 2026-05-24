import { render, screen } from '@testing-library/react';
import { it, expect, describe, vi } from 'vitest';
import { ResultList } from './result-list';
import type { PokemonListResponseResult } from '../../../shared/models';

const mockList: PokemonListResponseResult[] = [
  { url: 'https://pokeapi.co/api/v2/pokemon/1', name: 'bulbasaur' },
  { url: 'https://pokeapi.co/api/v2/pokemon/4', name: 'charmander' },
  { url: 'https://pokeapi.co/api/v2/pokemon/4', name: '' },
];

vi.mock('../pokemon-list-card/pokemon-list-card', () => ({
  PokemonListCard: ({
    pokemonBaseInfo,
  }: {
    pokemonBaseInfo: Partial<PokemonListResponseResult>;
  }) => (
    <div data-testid="pokemon-card" className="pokemon-card">
      {pokemonBaseInfo.name || 'Unknown pokemon'}
    </div>
  ),
}));

describe('Result list', () => {
  it('should show error message block', () => {
    render(<ResultList errorMsg="test error" list={[]}></ResultList>);

    expect(screen.getByText('test error')).toBeInTheDocument();
    expect(screen.queryByText('No results')).not.toBeInTheDocument();
  });

  it('should show info message on empty list', () => {
    render(<ResultList list={[]}></ResultList>);

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('should show cards for all list', () => {
    render(<ResultList list={mockList}></ResultList>);
    const cards = screen.getAllByTestId('pokemon-card');

    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent('bulbasaur');
    expect(cards[1]).toHaveTextContent('charmander');
    expect(cards[2]).toHaveTextContent('Unknown pokemon');
  });
});
