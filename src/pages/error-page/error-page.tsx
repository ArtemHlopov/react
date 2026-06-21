import { Link } from '../../i18n/navigation';
import './error-page.css';
export default function ErrorPage() {
  return (
    <div className="wrapper">
      <h1>404</h1>
      <p>Page not found</p>
      <Link className="nav-link" href="/">
        <button className="button_red_rounded">Home</button>
      </Link>
    </div>
  );
}
