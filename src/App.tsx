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
            <div key={form.name}>{form.name}</div>
          ))
        : 'There is no submitted forms yet'}
    </>
  );
}

export default App;
