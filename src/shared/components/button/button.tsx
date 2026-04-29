import { Component, type JSX, type MouseEvent } from 'react';
import type { Callback, CustomComponentProps } from '../../models';

interface ButtonProps extends CustomComponentProps {
  text?: string;
  className?: string;
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
        <button className={this.props.className} onClick={this.handleClick}>
          {this.props.text || 'Click'}
        </button>
      </div>
    );
  };
}
