import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface CountriesState {
  countries: string[];
}

export const COUNTRIES_LIST = [
  'Belarus',
  'Poland',
  'Russia',
  'Ukraine',
  'Germany',
  'France',
  'Italy',
];

const initialState: CountriesState = {
  countries: COUNTRIES_LIST,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const countriesSelector = (state: RootState) => state.countries;

export default countriesSlice.reducer;
