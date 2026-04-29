import { Component, type JSX } from 'react';
import type { FilterProps } from '../../../shared/models';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { Button } from '../../../shared/components/button/button';
import './search-field.css';

interface SearchState {
  filter: string;
}

export class SearchField extends Component<FilterProps, SearchState> {
  protected readonly inputPlaceholder = 'Search pokemon by name';
  constructor(props: FilterProps) {
    super(props);
    this.state = { filter: props.filter || '' };
  }

  protected readonly handleInputChange = (value: unknown): void => {
    this.setState({ filter: String(value) });
  };

  protected readonly handleSearchClick = (): void => {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(this.state.filter);
    }
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="search_field_wrapper">
        <TextInput
          value={this.state.filter}
          placeholder={this.inputPlaceholder}
          onChange={this.handleInputChange}
        />
        <Button onClick={this.handleSearchClick} text="Search" />
      </div>
    );
  };
}
