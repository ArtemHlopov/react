import { it, expect, describe } from 'vitest';
import { capitalizeStr } from './capitalizeStr';

describe('Test capitalizeStr helper', () => {
  it('return empty string for falsy prop', () => {
    expect(capitalizeStr('')).toBe('');
  });

  it('return capitalized string', () => {
    expect(capitalizeStr('name')).toBe('Name');
  });
});
