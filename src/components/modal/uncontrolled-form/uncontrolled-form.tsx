import { useRef } from 'react';
import type { FormValue } from '../../../models/common';

function UncontrolledForm() {
  const uncontrolled_name = useRef<HTMLInputElement>(null);
  const uncontrolled_age = useRef<HTMLInputElement>(null);
  const uncontrolled_gender = useRef<HTMLSelectElement>(null);
  const uncontrolled_email = useRef<HTMLInputElement>(null);
  const uncontrolled_terms = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: FormValue = {
      name: uncontrolled_name.current?.value || '',
      age: Number(uncontrolled_age.current?.value) || 0,
      email: uncontrolled_email.current?.value || '',
      gender: uncontrolled_gender.current?.value || 'unknown',
      terms: uncontrolled_terms.current?.checked || false,
    };

    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
          <option value="unknown">Unknown</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label htmlFor="uncontrolled_terms">Terms and Conditions</label>
        <input
          id="uncontrolled_terms"
          type="checkbox"
          name="terms"
          ref={uncontrolled_terms}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
export default UncontrolledForm;
