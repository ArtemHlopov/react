import { Component, type ChangeEvent, type JSX } from 'react';
import type { Callback, CustomComponentProps } from '../../models';
import './select.css';
import { generateRandomId } from '../../helpers/generateRandomId';

interface SelectOptions {
  title: string;
  value: string | number;
}

interface SelectProps extends CustomComponentProps {
  id?: string;
  options: SelectOptions[];
  disabled?: boolean;
  onSelectChange?: Callback;
}

export class Select extends Component<SelectProps> {
  protected readonly handleChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    const callback = this.props.onSelectChange;
    if (callback) {
      callback(event.target.value);
    }
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="select_wrapper">
        <select
          id={this.props.id || `select-${generateRandomId()}`}
          onChange={this.handleChange}
          disabled={this.props.disabled}
        >
          {this.props.options.map((option, index) => (
            <option key={`option-${index}-key`} value={option.value}>
              {option.title}
            </option>
          ))}
        </select>
      </div>
    );
  };
}
