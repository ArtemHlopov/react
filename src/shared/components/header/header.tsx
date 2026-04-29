import { Component, type JSX } from 'react';
import pokedexImage from '../../../assets/Pokédex_logo.png';
import './header.css';

export class Header extends Component {
  readonly render = (): JSX.Element => {
    return (
      <div className="header_wrapper">
        <img className="header_logo" src={pokedexImage} alt="pokedex" />
      </div>
    );
  };
}
