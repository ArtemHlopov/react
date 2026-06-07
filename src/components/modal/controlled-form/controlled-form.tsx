import { Controller, useForm } from 'react-hook-form';
import {
  FormTypeEnum,
  GenderEnum,
  type FormValue,
} from '../../../models/common';
import { addSubmittedForm } from '../../../store/submitted-form-slice';
import { useAppDispatch } from '../../../store/hooks';

function ControlledForm() {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: GenderEnum.unknown,
      terms: false,
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValue) => {
    dispatch(addSubmittedForm({ ...data, type: FormTypeEnum.controlled }));
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default ControlledForm;
