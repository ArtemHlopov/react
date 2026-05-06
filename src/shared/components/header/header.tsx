import { Component, type JSX } from 'react';
import pokedexImage from '../../../assets/Pokédex_logo.png';
import './header.css';
import { Button } from '../button/button';

interface HeaderState {
  error: boolean;
}
export class Header extends Component<object, HeaderState> {
  constructor(props: object) {
    super(props);
    this.state = { error: false };
  }
  protected readonly handleTestErrorClick = (): void => {
    this.setState({ error: true });
  };
  readonly render = (): JSX.Element => {
    if (this.state.error) {
      throw new Error('Test application error');
    }

    return (
      <div className="header_wrapper">
        <img className="header_logo" src={pokedexImage} alt="pokedex" />
        <Button text="Test error" onClick={this.handleTestErrorClick} />
      </div>
    );
  };
}
