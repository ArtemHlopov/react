import type {
  CustomComponentProps,
  PokemonListResponseResult,
} from '../../../shared/models';
import { PokemonListCard } from '../pokemon-list-card/pokemon-list-card';
import './result-list.css';

interface ResultListProps extends CustomComponentProps {
  list: PokemonListResponseResult[];
  errorMsg?: string;
}

export const ResultList = ({ list, errorMsg }: ResultListProps) => {
  if (errorMsg) {
    return <div className="result_list">{errorMsg}</div>;
  }

  if (!list || list.length === 0) {
    return <div className="result_list">No results</div>;
  }

  return (
    <div className="result_list">
      {list.map((item) => (
        <PokemonListCard key={item.url} pokemonBaseInfo={item} />
      ))}
    </div>
  );
};
