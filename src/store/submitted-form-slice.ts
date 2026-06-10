import type { FormTypedValue } from '../models/common';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface SubmittedFormsState {
  submittedForms: FormTypedValue[];
  latestId: string | null;
}

const initialState: SubmittedFormsState = {
  submittedForms: [],
  latestId: null,
};

const submittedFormSlice = createSlice({
  name: 'submittedForms',
  initialState,
  reducers: {
    addSubmittedForm: (state, action: PayloadAction<FormTypedValue>) => {
      state.submittedForms.push(action.payload);
      state.latestId = action.payload.id;
    },
  },
});

export const { addSubmittedForm } = submittedFormSlice.actions;

export const submittedFormsSelector = (state: RootState) =>
  state.submittedForms;

export const latestIdSelector = (state: RootState) =>
  state.submittedForms.latestId;

export default submittedFormSlice.reducer;
