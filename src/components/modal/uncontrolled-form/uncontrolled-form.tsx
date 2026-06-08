import { useRef, useState } from 'react';
import { imageToBase64 } from '../../../helpers/image-to-base64';
import {
  FormTypeEnum,
  GenderEnum,
  type Callback,
  type FormTypedValue,
  type FormValue,
} from '../../../models/common';
import { useAppDispatch } from '../../../store/hooks';
import { addSubmittedForm } from '../../../store/submitted-form-slice';
import Autocomplete from '../../autocomplete/autocomplete';
import './uncontrolled-form.css';
import { formSchema } from '../form-config';
import { COUNTRIES_LIST } from '../../../store/countries-slice';
import * as yup from 'yup';

function UncontrolledForm({ onClose }: { onClose: Callback }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const uncontrolled_name = useRef<HTMLInputElement>(null);
  const uncontrolled_age = useRef<HTMLInputElement>(null);
  const uncontrolled_gender = useRef<HTMLSelectElement>(null);
  const uncontrolled_email = useRef<HTMLInputElement>(null);
  const uncontrolled_terms = useRef<HTMLInputElement>(null);
  const uncontrolled_country = useRef<HTMLInputElement>(null);
  const uncontrolled_password = useRef<HTMLInputElement>(null);
  const uncontrolled_password_confirm = useRef<HTMLInputElement>(null);
  const uncontrolled_image = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: FormValue = {
      name: uncontrolled_name.current?.value || '',
      age: Number(uncontrolled_age.current?.value) || 0,
      email: uncontrolled_email.current?.value || '',
      gender: uncontrolled_gender.current?.value || GenderEnum.unknown,
      terms: uncontrolled_terms.current?.checked || false,
      country: uncontrolled_country.current?.value || '',
      password: uncontrolled_password.current?.value || '',
      password_confirm: uncontrolled_password_confirm.current?.value || '',
      image: uncontrolled_image.current?.files?.[0] || null,
    };

    try {
      await formSchema(COUNTRIES_LIST).validate(data, { abortEarly: false });
      setErrors({});
      dispatch(addSubmittedForm(await preparedData(data)));
      onClose();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const formattedErrors: Record<string, string> = {};

        error.inner.forEach((error) => {
          if (error.path) {
            formattedErrors[error.path] = error.message;
          }
        });

        setErrors(formattedErrors);
      }
    }
  };

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
      type: FormTypeEnum.uncontrolled,
    };
  };

  return (
    <>
      <form className="uncontrolled_form_wrapper" onSubmit={handleSubmit}>
        <h3>Uncontrolled Form</h3>
        <label htmlFor="uncontrolled_name">Name</label>
        <input
          id="uncontrolled_name"
          type="text"
          name="name"
          ref={uncontrolled_name}
        />
        {errors.name && <p>{errors.name}</p>}
        <label htmlFor="uncontrolled_age">Age</label>
        <input
          id="uncontrolled_age"
          type="number"
          name="age"
          min="0"
          ref={uncontrolled_age}
        />
        {errors.age && <p>{errors.age}</p>}
        <label htmlFor="uncontrolled_email">Email</label>
        <input
          id="uncontrolled_email"
          type="email"
          name="email"
          ref={uncontrolled_email}
        />
        {errors.email && <p>{errors.email}</p>}
        <label htmlFor="uncontrolled_gender">Gender</label>
        <select
          id="uncontrolled_gender"
          name="gender"
          ref={uncontrolled_gender}
        >
          {Object.keys(GenderEnum).map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        {errors.gender && <p>{errors.gender}</p>}
        <label htmlFor="uncontrolled_terms">Terms and Conditions</label>
        <input
          id="uncontrolled_terms"
          type="checkbox"
          name="terms"
          ref={uncontrolled_terms}
        />
        {errors.terms && <p>{errors.terms}</p>}
        <label htmlFor="uncontrolled_country">Country</label>
        <Autocomplete
          id="uncontrolled_country"
          ref={uncontrolled_country}
          name="country"
          placeholder="Select country"
        />
        {errors.country && <p>{errors.country}</p>}
        <label htmlFor="uncontrolled_password">Password</label>
        <input
          id="uncontrolled_password"
          type="password"
          name="password"
          ref={uncontrolled_password}
        />
        {errors.password && <p>{errors.password}</p>}
        <label htmlFor="uncontrolled_password_confirm">Confirm Password</label>
        <input
          id="uncontrolled_password_confirm"
          type="password"
          name="password_confirm"
          ref={uncontrolled_password_confirm}
        />
        {errors.password_confirm && <p>{errors.password_confirm}</p>}
        <label htmlFor="uncontrolled_image">
          Image (PNG / JPEG)
          <input
            id="uncontrolled_image"
            type="file"
            name="image"
            accept="image/png,image/jpeg"
            ref={uncontrolled_image}
          />
        </label>
        {errors.image && <p>{errors.image}</p>}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
export default UncontrolledForm;
