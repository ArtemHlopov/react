import { Component, type JSX, type MouseEvent } from 'react';
import type { Callback, CustomComponentProps } from '../../models';
import { generateRandomId } from '../../helpers';

interface ButtonProps extends CustomComponentProps {
  id?: string;
  text?: string;
  className?: string;
  disabled?: boolean;
  onClick?: Callback;
}

export class Button extends Component<ButtonProps> {
  protected readonly handleClick = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    const callback = this.props.onClick;
    if (callback) {
      callback(event);
    }
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="button_wrapper">
        <button
          id={this.props.id || `button-${generateRandomId()}`}
          className={this.props.className}
          onClick={this.handleClick}
          disabled={this.props.disabled}
        >
          {this.props.text || 'Click'}
        </button>
      </div>
    );
  };
}
