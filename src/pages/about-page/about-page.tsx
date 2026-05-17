import { Link } from 'react-router-dom';
import './about-page.css';

export const AboutPage = () => {
  return (
    <div className="about_page_wrapper">
      <p>App where you can find your pokemon.</p>
      <Link className="nav-link" to={`/`}>
        <button className="button_red_rounded">Home</button>
      </Link>
      <Link to="https://rs.school/courses/reactjs" target="_blank">
        <div className="img-logo"></div>
      </Link>
    </div>
  );
};
