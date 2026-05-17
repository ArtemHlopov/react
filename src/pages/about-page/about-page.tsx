import { Link } from 'react-router-dom';
import './about-page.css';

export const AboutPage = () => {
  return (
    <div className="wrapper">
      <p>App where you can find your pokemon.</p>
      <Link className="nav-link" to={`/`}>
        <button>Back</button>
      </Link>
      <Link to="https://rs.school/courses/reactjs" target="_blank">
        <div className="img-logo"></div>
      </Link>
    </div>
  );
};
