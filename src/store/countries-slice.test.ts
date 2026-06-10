import { describe, it, expect } from 'vitest';
import reducer, { COUNTRIES_LIST, countriesSelector } from './countries-slice';
import { makeStore } from '../test/renderWithStore';

describe('countriesSlice', () => {
  it('returns COUNTRIES_LIST as initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.countries).toEqual(COUNTRIES_LIST);
  });

  it('COUNTRIES_LIST contains expected countries', () => {
    expect(COUNTRIES_LIST).toContain('Poland');
    expect(COUNTRIES_LIST).toContain('Germany');
    expect(COUNTRIES_LIST).toContain('France');
  });

  it('selector returns countries from store', () => {
    const store = makeStore();
    const result = countriesSelector(store.getState());
    expect(result.countries).toEqual(COUNTRIES_LIST);
  });
});
