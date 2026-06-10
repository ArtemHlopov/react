import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { makeStore } from './test/renderWithStore';
import { addSubmittedForm } from './store/submitted-form-slice';
import type { FormTypedValue } from './models/common';

// Mock Header to avoid portal complexity in App tests
vi.mock('./components/header/header', () => ({
  default: () => <div data-testid="header" />,
}));

const mockForm: FormTypedValue = {
  id: '1',
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  gender: 'female',
  terms: true,
  country: 'Poland',
  password: 'Pass1!',
  password_confirm: 'Pass1!',
  image: '',
  type: 'controlled',
};

describe('App', () => {
  it('renders header', () => {
    render(<Provider store={makeStore()}><App /></Provider>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('shows empty state when no forms submitted', () => {
    render(<Provider store={makeStore()}><App /></Provider>);
    expect(screen.getByText('No submitted forms yet')).toBeInTheDocument();
  });

  it('renders a card for each submitted form', () => {
    const store = makeStore();
    store.dispatch(addSubmittedForm(mockForm));
    render(<Provider store={store}><App /></Provider>);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Poland')).toBeInTheDocument();
  });

  it('renders "Accepted" when terms is true', () => {
    const store = makeStore();
    store.dispatch(addSubmittedForm(mockForm));
    render(<Provider store={store}><App /></Provider>);
    expect(screen.getByText('Accepted')).toBeInTheDocument();
  });

  it('renders badge with form type', () => {
    const store = makeStore();
    store.dispatch(addSubmittedForm(mockForm));
    render(<Provider store={store}><App /></Provider>);
    expect(screen.getByText('controlled')).toBeInTheDocument();
  });
});
