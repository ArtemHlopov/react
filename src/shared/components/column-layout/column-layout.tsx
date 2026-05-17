import { type ReactNode } from 'react';
import type { CustomComponentProps } from '../../models';
import { Header } from '../header/header.tsx';
import { Footer } from '../footer/footer.tsx';
import './column-layout.css';

interface ColumnLayoutProps extends CustomComponentProps {
  children?: ReactNode;
}

export const ColumnLayout = ({ children }: ColumnLayoutProps) => {
  return (
    <div className="layout">
      <Header></Header>
      <div className="content_wrapper">
        {children || <div>No content</div>}
      </div>
      <Footer></Footer>
    </div>
  );
};
