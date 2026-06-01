import { it, expect, describe, vi } from 'vitest';
import { Button } from './button';
import { logRoles, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button component', () => {
  it('render button with default text', () => {
    const { container } = render(<Button></Button>);

    logRoles(container);

    expect(
      screen.getByRole('button', {
        name: 'Click',
      })
    ).toBeInTheDocument();
  });

  it('render button with text in props', () => {
    render(<Button text="test_btn"></Button>);

    expect(
      screen.getByRole('button', {
        name: 'test_btn',
      })
    ).toBeInTheDocument();
  });

  it('render button with text in props', async () => {
    const user = userEvent.setup();
    const clickHandler = vi.fn();

    render(<Button onClick={clickHandler}></Button>);

    await user.click(
      screen.getByRole('button', {
        name: 'Click',
      })
    );

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('without callback in props', async () => {
    const user = userEvent.setup();

    render(<Button />);

    const button = screen.getByRole('button', { name: 'Click' });

    await expect(user.click(button)).resolves.not.toThrow();
  });

  it('should be disabled', () => {
    render(<Button disabled={true} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply className', () => {
    render(<Button className="primary-btn" />);

    expect(screen.getByRole('button')).toHaveClass('primary-btn');
  });

  it('should render custom id', () => {
    render(<Button id="submit-btn" />);

    expect(screen.getByRole('button')).toHaveAttribute('id', 'submit-btn');
  });
});
