import { Link } from 'react-router-dom';
import './error-page.css';
export const ErrorPage = () => {
  return (
    <div className="wrapper">
      <h1>404</h1>
      <p>Page not found</p>
      <Link className="nav-link" to={`/`}>
        <button>Home</button>
      </Link>
    </div>
  );
};
