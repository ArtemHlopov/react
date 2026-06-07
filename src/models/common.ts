export type Callback = (value?: unknown) => void;

export interface FormValue {
  name: string;
  age: number;
  email: string;
  gender: string;
  terms: boolean;
}
