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
  image: File | null;
}

export type FormTypedValue = Omit<FormValue, 'image'> & {
  type: FormType;
  id: string;
  image: string;
};

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
