export type Callback = (value?: unknown) => void;

export interface FormValue {
  name: string;
  age: number;
  email: string;
  gender: string;
  terms: boolean;
  country: string;
  password: string;
  password_confirm: string;
  image: string;
}

export type FormTypedValue = FormValue & { type: FormType; id: string };

export enum FormTypeEnum {
  controlled = 'controlled',
  uncontrolled = 'uncontrolled',
}

export type FormType = `${FormTypeEnum}`;

export enum GenderEnum {
  unknown = 'unknown',
  male = 'male',
  female = 'female',
}
