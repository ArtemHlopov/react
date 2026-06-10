import { describe, it, expect } from 'vitest';
import reducer, {
  addSubmittedForm,
  submittedFormsSelector,
} from './submitted-form-slice';
import { makeStore } from '../test/renderWithStore';
import type { FormTypedValue } from '../models/common';

const mockForm: FormTypedValue = {
  id: '1',
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: 'male',
  terms: true,
  country: 'Poland',
  password: 'Pass1!',
  password_confirm: 'Pass1!',
  image: '',
  type: 'controlled',
};

describe('submittedFormSlice', () => {
  it('returns empty array as initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.submittedForms).toEqual([]);
  });

  it('adds a form when addSubmittedForm is dispatched', () => {
    const state = reducer(undefined, addSubmittedForm(mockForm));
    expect(state.submittedForms).toHaveLength(1);
    expect(state.submittedForms[0]).toEqual(mockForm);
  });

  it('accumulates multiple forms', () => {
    let state = reducer(undefined, addSubmittedForm(mockForm));
    state = reducer(state, addSubmittedForm({ ...mockForm, id: '2' }));
    expect(state.submittedForms).toHaveLength(2);
  });

  it('selector returns submittedForms from store', () => {
    const store = makeStore();
    store.dispatch(addSubmittedForm(mockForm));
    const result = submittedFormsSelector(store.getState());
    expect(result.submittedForms).toHaveLength(1);
    expect(result.submittedForms[0].name).toBe('John');
  });
});
