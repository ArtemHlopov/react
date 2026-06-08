import * as yup from 'yup';
import { ALLOWED_IMAGE_TYPES } from '../../helpers/image-to-base64';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const regexList = {
  name: /^[A-ZА-Я]/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).+$/,
};

const emailValidator = (v: string) => {
  if (!v) return false;
  const parts = v.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return !!local.trim() && domain.includes('.');
};

export const formSchema = (countries: string[]) =>
  yup.object({
    name: yup
      .string()
      .required('Name is required')
      .test('first-letter-uppercase', 'First letter must be uppercase', (v) => {
        if (!v) return false;
        const regex = regexList.name;
        return regex.test(v);
      }),
    age: yup
      .number()
      .min(0, 'Age must be positive number')
      .required('Age is required'),
    email: yup
      .string()
      .required('Email is required')
      .test('valid-email', 'Email isnt valid', emailValidator),
    country: yup
      .string()
      .required('Country is required')
      .test('country-exists', 'Country does not exist', (value) => {
        if (!value) return false;

        return countries.includes(value);
      }),
    gender: yup.string().required('Gender is required'),
    terms: yup.boolean().required(),
    password: yup
      .string()
      .required('Password is required')
      .test('valid-password', 'Password isnt valid', (v) => {
        if (!v) return false;
        const regex = regexList.password;
        return regex.test(v);
      }),
    password_confirm: yup
      .string()
      .required('Confirmation required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    image: yup
      .mixed<File>()
      .nullable()
      .required('Img is required')
      .test('file-size', 'Max image size is 2MB', (file) => {
        if (!file) return false;

        return file.size <= MAX_IMAGE_SIZE;
      })
      .test('file-format', 'Only PNG and JPEG are allowed', (file) => {
        if (!file) return false;

        return ALLOWED_IMAGE_TYPES.includes(file.type);
      }),
  });
