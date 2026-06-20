import { Link } from '../../shared/navigation/navigation';
import './about-page.css';

export const AboutPage = () => {
  return (
    <div className="about_page_wrapper">
      <p>App where you can find your pokemon.</p>
      <p>Created by Artem Hlopov</p>
      <Link className="nav-link" href="/">
        <button className="button_red_rounded">Home</button>
      </Link>
      <Link href="https://rs.school/courses/reactjs" target="_blank">
        <div className="img-logo"></div>
      </Link>
    </div>
  );
};
