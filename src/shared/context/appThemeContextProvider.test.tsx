import { render, screen, fireEvent } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { DarkThemeContext } from './appThemeContext';
import { DarkThemeProvider } from './appThemeContextProvider';

const TestComponent = () => {
  const { isDarkTheme, toggleTheme } = useContext(DarkThemeContext);
  return (
    <div>
      <span data-testid="theme">{isDarkTheme ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('DarkThemeProvider', () => {
  it('should provide light theme by default and toggle to dark theme', () => {
    render(
      <DarkThemeProvider>
        <TestComponent />
      </DarkThemeProvider>
    );

    const themeSpan = screen.getByTestId('theme');
    expect(themeSpan.textContent).toBe('light');

    const toggleButton = screen.getByRole('button', { name: 'Toggle' });
    fireEvent.click(toggleButton);

    expect(themeSpan.textContent).toBe('dark');

    fireEvent.click(toggleButton);
    expect(themeSpan.textContent).toBe('light');
  });
});
