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
    addSubmittedForm: (state, action: PayloadAction<FormTypedValue>) => {
      state.submittedForms.push(action.payload);
    },
  },
});

export const { addSubmittedForm } = submittedFormSlice.actions;

export const submittedFormsSelector = (state: RootState) =>
  state.submittedForms;

export default submittedFormSlice.reducer;
