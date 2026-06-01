import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

const getStatusCode = (error: FetchBaseQueryError): number | undefined => {
  if (typeof error.status === 'number') {
    return error.status;
  }

  if (error.status === 'PARSING_ERROR') {
    return error.originalStatus;
  }

  return undefined;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (!error) {
    return '';
  }

  if (isFetchBaseQueryError(error)) {
    const statusCode = getStatusCode(error);

    if (statusCode === 404) {
      return 'Pokemon not found. Check the name and try again.';
    }

    if (statusCode === 400) {
      return 'Bad request. Please check your input.';
    }

    if (statusCode === 500) {
      return 'Server error. Try again later.';
    }

    if (error.status === 'FETCH_ERROR') {
      return 'Network error. Check your connection and try again.';
    }

    return 'Unable to load data. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Network error. Check your connection and try again.';
};
