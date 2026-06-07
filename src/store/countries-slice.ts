import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface CountriesState {
  countries: string[];
}

const initialState: CountriesState = {
  countries: [
    'Belarus',
    'Poland',
    'Russia',
    'Ukraine',
    'Germany',
    'France',
    'Italy',
  ],
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const countriesSelector = (state: RootState) => state.countries;

export default countriesSlice.reducer;
