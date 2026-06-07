import { Controller, useForm } from 'react-hook-form';
import {
  FormTypeEnum,
  GenderEnum,
  type FormValue,
} from '../../../models/common';
import { addSubmittedForm } from '../../../store/submitted-form-slice';
import { useAppDispatch } from '../../../store/hooks';
import Autocomplete from '../../autocomplete/autocomplete';
import { imageToBase64 } from '../../../helpers/image-to-base64';
import './controlled-form.css';

function ControlledForm() {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: GenderEnum.unknown,
      terms: false,
      country: '',
      password: '',
      password_confirm: '',
      image: '',
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValue) => {
    dispatch(addSubmittedForm({ ...data, type: FormTypeEnum.controlled }));
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
          render={({ field }) => (
            <label htmlFor={field.name}>
              Name
              <input id={field.name} type="text" {...field} />
            </label>
          )}
        />
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <label htmlFor={field.name}>
              Age
              <input id={field.name} type="number" min="0" {...field} />
            </label>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <label htmlFor={field.name}>
              Email
              <input id={field.name} type="email" {...field} />
            </label>
          )}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <label htmlFor={field.name}>
              Gender
              <select id={field.name} {...field}>
                {Object.keys(GenderEnum).map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </label>
          )}
        />
        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <label htmlFor={field.name}>
              Terms and Conditions
              <input
                id={field.name}
                type="checkbox"
                name={field.name}
                checked={field.value}
                onChange={field.onChange}
              />
            </label>
          )}
        />
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <label htmlFor={field.name}>
              Country
              <Autocomplete
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select country"
              />
            </label>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <label htmlFor={field.name}>
              Password
              <input id={field.name} type="password" {...field} />
            </label>
          )}
        />
        <Controller
          name="password_confirm"
          control={control}
          render={({ field }) => (
            <label htmlFor={field.name}>
              Confirm Password
              <input id={field.name} type="password" {...field} />
            </label>
          )}
        />
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
            <label htmlFor="image">
              Image (PNG / JPEG)
              <input
                id="image"
                type="file"
                accept="image/png,image/jpeg"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const base64 = await imageToBase64(file);
                    onChange(base64);
                  } catch (error) {
                    onChange('');
                    console.error(error);
                  }
                }}
              />
            </label>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default ControlledForm;
