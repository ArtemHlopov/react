import { Component, type JSX } from 'react';
import type { CustomComponentProps } from '../../models';
import { Header } from '../header/header.tsx';
import { Footer } from '../footer/footer.tsx';
import './column-layout.css';

interface ColumnLayoutProps extends CustomComponentProps {
  component: JSX.Element;
}

export class ColumnLayout extends Component<ColumnLayoutProps> {
  readonly render = (): JSX.Element => {
    const Component = this.props.component;
    return (
      <div className="layout">
        <Header></Header>
        <div className="content_wrapper">
          {Component || <div>No content</div>}
        </div>

        <Footer></Footer>
      </div>
    );
  };
}
