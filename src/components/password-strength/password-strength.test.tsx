import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordStrength from './password-strength';

describe('PasswordStrength', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows all four criteria labels', () => {
    render(<PasswordStrength password="Abc1!" />);
    expect(screen.getByText(/uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/number/i)).toBeInTheDocument();
    expect(screen.getByText(/special character/i)).toBeInTheDocument();
  });

  it('marks criteria as met when password satisfies them', () => {
    render(<PasswordStrength password="Abc1!" />);
    const items = document.querySelectorAll('.met');
    expect(items.length).toBe(4);
  });

  it('marks criteria as unmet when password is weak', () => {
    render(<PasswordStrength password="abc" />);
    const unmet = document.querySelectorAll('.unmet');
    expect(unmet.length).toBeGreaterThan(0);
  });
});
