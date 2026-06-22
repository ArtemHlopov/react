import { it, expect, describe } from 'vitest';
import { generateRandomId } from './generateRandomId';

describe('Test id generator', () => {
  it('should return string', () => {
    expect(typeof generateRandomId()).toBe('string');
  });

  it('should return string with length > 10', () => {
    expect(generateRandomId().length > 10).toBeTruthy();
  });
});
