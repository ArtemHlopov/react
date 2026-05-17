import './footer.css';
import type { CustomComponentProps } from '../../models';

export interface FooterProps extends CustomComponentProps {
  text?: string;
}
export const Footer = ({ text = '2026' }: FooterProps) => {
  return <div className="footer_wrapper">{text}</div>;
};
