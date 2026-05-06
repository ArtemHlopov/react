import { Component, type ChangeEvent, type JSX } from 'react';
import type { Callback, CustomComponentProps } from '../../models';
import { generateRandomId } from '../../helpers';

interface TextInputProps extends CustomComponentProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  onChange?: Callback;
}

export class TextInput extends Component<TextInputProps> {
  protected readonly handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const callback = this.props.onChange;
    if (callback) {
      callback(event.target.value);
    }
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="input_wrapper">
        <input
          id={this.props.id || `$input-text-${generateRandomId()}`}
          name={this.props.name || 'input-text-name'}
          type="text"
          placeholder={this.props.placeholder || 'Enter value'}
          value={this.props.value}
          className={this.props.className}
          onChange={this.handleChange}
        />
      </div>
    );
  };
}
