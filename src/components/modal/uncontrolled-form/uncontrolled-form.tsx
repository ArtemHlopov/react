import { useRef, useState } from 'react';
import { imageToBase64 } from '../../../helpers/image-to-base64';
import {
  FormTypeEnum,
  GenderEnum,
  type FormValue,
} from '../../../models/common';
import { useAppDispatch } from '../../../store/hooks';
import { addSubmittedForm } from '../../../store/submitted-form-slice';
import Autocomplete from '../../autocomplete/autocomplete';
import './uncontrolled-form.css';

function UncontrolledForm() {
  const uncontrolled_name = useRef<HTMLInputElement>(null);
  const uncontrolled_age = useRef<HTMLInputElement>(null);
  const uncontrolled_gender = useRef<HTMLSelectElement>(null);
  const uncontrolled_email = useRef<HTMLInputElement>(null);
  const uncontrolled_terms = useRef<HTMLInputElement>(null);
  const uncontrolled_country = useRef<HTMLInputElement>(null);
  const uncontrolled_password = useRef<HTMLInputElement>(null);
  const uncontrolled_password_confirm = useRef<HTMLInputElement>(null);
  const [imageBase64, setImageBase64] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
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
      image: imageBase64,
    };

    dispatch(addSubmittedForm({ ...data, type: FormTypeEnum.uncontrolled }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await imageToBase64(file);
      setImageBase64(base64);
    } catch (error) {
      console.error(error);
      setImageBase64('');
    }
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
        <label htmlFor="uncontrolled_age">Age</label>
        <input
          id="uncontrolled_age"
          type="number"
          name="age"
          min="0"
          ref={uncontrolled_age}
        />
        <label htmlFor="uncontrolled_email">Email</label>
        <input
          id="uncontrolled_email"
          type="email"
          name="email"
          ref={uncontrolled_email}
        />
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
        <label htmlFor="uncontrolled_terms">Terms and Conditions</label>
        <input
          id="uncontrolled_terms"
          type="checkbox"
          name="terms"
          ref={uncontrolled_terms}
        />
        <label htmlFor="uncontrolled_country">Country</label>
        <Autocomplete
          id="uncontrolled_country"
          ref={uncontrolled_country}
          name="country"
          placeholder="Select country"
        />
        <label htmlFor="uncontrolled_password">Password</label>
        <input
          id="uncontrolled_password"
          type="password"
          name="password"
          ref={uncontrolled_password}
        />
        <label htmlFor="uncontrolled_password_confirm">Confirm Password</label>
        <input
          id="uncontrolled_password_confirm"
          type="password"
          name="password_confirm"
          ref={uncontrolled_password_confirm}
        />
        <label htmlFor="uncontrolled_image">
          Image (PNG / JPEG)
          <input
            id="uncontrolled_image"
            type="file"
            name="image"
            accept="image/png,image/jpeg"
            onChange={handleImageChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
export default UncontrolledForm;
