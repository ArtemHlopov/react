import { Controller, useForm, type Resolver } from 'react-hook-form';
import {
  FormTypeEnum,
  GenderEnum,
  type Callback,
  type FormTypedValue,
  type FormValue,
} from '../../../models/common';
import { addSubmittedForm } from '../../../store/submitted-form-slice';
import { useAppDispatch } from '../../../store/hooks';
import Autocomplete from '../../autocomplete/autocomplete';
import { imageToBase64 } from '../../../helpers/image-to-base64';
import './controlled-form.css';
import { yupResolver } from '@hookform/resolvers/yup/src/yup.js';
import { formSchema } from '../form-config';
import { COUNTRIES_LIST } from '../../../store/countries-slice';

function ControlledForm({ onClose }: { onClose: Callback }) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValue>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: GenderEnum.unknown,
      terms: false,
      country: '',
      password: '',
      password_confirm: '',
      image: null,
    },
    resolver: yupResolver(formSchema(COUNTRIES_LIST)) as Resolver<FormValue>,
  });
  const dispatch = useAppDispatch();

  const preparedData = async (data: FormValue): Promise<FormTypedValue> => {
    let base64 = '';
    if (data.image) {
      try {
        base64 = await imageToBase64(data.image);
      } catch (error) {
        console.error(error);
      }
    }
    return {
      ...data,
      image: base64,
      id: crypto.randomUUID(),
      type: FormTypeEnum.controlled,
    };
  };

  const onSubmit = async (data: FormValue) => {
    const transformedData = await preparedData(data);
    dispatch(addSubmittedForm(transformedData));
    onClose();
  };

  return (
    <>
      <form
        className="controlled_form_wrapper"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Controlled Form</h3>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Name
              <input id={field.name} type="text" {...field} />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="age"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Age
              <input id={field.name} type="number" min="0" {...field} />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Email
              <input id={field.name} type="email" {...field} />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Gender
              <select id={field.name} {...field}>
                {Object.keys(GenderEnum).map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="terms"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Terms and Conditions
              <input
                id={field.name}
                type="checkbox"
                name={field.name}
                checked={field.value}
                onChange={field.onChange}
              />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="country"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Country
              <Autocomplete
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select country"
              />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Password
              <input id={field.name} type="password" {...field} />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="password_confirm"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <label htmlFor={field.name}>
              Confirm Password
              <input id={field.name} type="password" {...field} />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <Controller
          name="image"
          control={control}
          render={({
            field: { onChange, onBlur, name, ref },
            fieldState: { error },
          }) => (
            <label htmlFor="image">
              Image (PNG / JPEG)
              <input
                id="image"
                type="file"
                accept="image/png,image/jpeg"
                name={name}
                ref={ref}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
              />
              {error && <p>{error.message}</p>}
            </label>
          )}
        />
        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>
    </>
  );
}

export default ControlledForm;
