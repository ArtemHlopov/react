import './App.css';
import Header from './components/header/header';
import {
  submittedFormsSelector,
  latestIdSelector,
} from './store/submitted-form-slice';
import type { FormTypedValue } from './models/common';
import { useAppSelector } from './store/hooks';

function App() {
  const submitted = useAppSelector(submittedFormsSelector);
  const latestId = useAppSelector(latestIdSelector);
  return (
    <>
      <Header />
      <main className="page">
        {submitted.submittedForms.length ? (
          <div className="cards">
            {submitted.submittedForms.map((form: FormTypedValue) => (
              <div
                className={`card${form.id === latestId ? ' card__new' : ''}`}
                key={form.id}
              >
                {form.image && (
                  <img className="card__image" src={form.image} alt="avatar" />
                )}
                <span className="card__badge">{form.type}</span>
                <span className="card__label">Name</span>
                <span className="card__value">{form.name}</span>
                <span className="card__label">Age</span>
                <span className="card__value">{form.age}</span>
                <span className="card__label">Email</span>
                <span className="card__value">{form.email}</span>
                <span className="card__label">Country</span>
                <span className="card__value">{form.country}</span>
                <span className="card__label">Terms</span>
                <span className="card__value">
                  {form.terms ? 'Accepted' : 'Declined'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="page__empty">No submitted forms yet</p>
        )}
      </main>
    </>
  );
}

export default App;
