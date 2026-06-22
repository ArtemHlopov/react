import { describe, expect, it } from 'vitest';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getApiErrorMessage } from './getApiErrorMessage';

describe('getApiErrorMessage', () => {
  it.each([
    [404, 'Pokemon not found. Check the name and try again.'],
    [400, 'Bad request. Please check your input.'],
    [500, 'Server error. Try again later.'],
    [418, 'Unable to load data. Please try again.'],
  ])('returns a readable message for HTTP status %s', (status, message) => {
    expect(getApiErrorMessage({ status } as FetchBaseQueryError)).toBe(message);
  });

  it('returns a readable network error for fetch failures', () => {
    expect(
      getApiErrorMessage({
        status: 'FETCH_ERROR',
        error: 'Failed to fetch',
      })
    ).toBe('Network error. Check your connection and try again.');
  });

  it('returns the original status message for parsing errors', () => {
    expect(
      getApiErrorMessage({
        status: 'PARSING_ERROR',
        originalStatus: 404,
        data: '',
        error: 'Unexpected token',
      })
    ).toBe('Pokemon not found. Check the name and try again.');
  });

  it('returns Error messages and handles empty values', () => {
    expect(getApiErrorMessage(new Error('Custom failure'))).toBe(
      'Custom failure'
    );
    expect(getApiErrorMessage(undefined)).toBe('');
  });
});
