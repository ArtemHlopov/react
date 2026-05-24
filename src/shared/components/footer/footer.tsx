import './footer.css';
import type { CustomComponentProps } from '../../models';
import { useContext } from 'react';
import { DarkThemeContext } from '../../context/appThemeContext';

export interface FooterProps extends CustomComponentProps {
  text?: string;
}
export const Footer = ({ text = '2026' }: FooterProps) => {
  const { isDarkTheme } = useContext(DarkThemeContext);
  return (
    <div
      className={`footer_wrapper ${isDarkTheme ? 'footer_wrpper__dark' : ''}`}
    >
      {text}
    </div>
  );
};
