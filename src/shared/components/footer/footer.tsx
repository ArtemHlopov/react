import { Component, type JSX } from 'react';
import './footer.css';
import type { CustomComponentProps } from '../../models';

export interface FooterProps extends CustomComponentProps {
  text?: string;
}
export class Footer extends Component<FooterProps> {
  readonly render = (): JSX.Element => {
    return <div className="footer_wrapper">{this.props.text || '2026'}</div>;
  };
}
