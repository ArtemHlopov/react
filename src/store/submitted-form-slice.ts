import type { FormTypedValue } from '../models/common';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface SubmittedFormsState {
  submittedForms: FormTypedValue[];
}

const initialState: SubmittedFormsState = {
  submittedForms: [],
};

const submittedFormSlice = createSlice({
  name: 'submittedForms',
  initialState,
  reducers: {
    addSubmittedForm: (state, action: PayloadAction<Omit<FormTypedValue, 'id'>>) => {
      state.submittedForms.push({ ...action.payload, id: crypto.randomUUID() });
    },
  },
});

export const { addSubmittedForm } = submittedFormSlice.actions;

export const submittedFormsSelector = (state: RootState) =>
  state.submittedForms;

export default submittedFormSlice.reducer;
