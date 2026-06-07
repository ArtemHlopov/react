import './App.css';
import Header from './components/header/header';
import { submittedFormsSelector } from './store/submitted-form-slice';
import type { FormTypedValue } from './models/common';
import { useAppSelector } from './store/hooks';

function App() {
  const submitted = useAppSelector(submittedFormsSelector);
  return (
    <>
      <Header></Header>
      {submitted.submittedForms.length
        ? submitted.submittedForms.map((form: FormTypedValue) => (
            <div key={form.id}>
              <div>{form.name}</div>
              <div>{form.age}</div>
              <div>{form.email}</div>
              <div>{form.country}</div>
              <div>{form.terms}</div>
              <div>{form.type}</div>
              <div>{form.password}</div>
              {form.image && (
                <div>
                  <img src={form.image} alt="image" />
                </div>
              )}
            </div>
          ))
        : 'There is no submitted forms yet'}
    </>
  );
}

export default App;
