import { getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/navigation';
import './about-page.css';

export default async function AboutPage() {
  const t = await getTranslations('aboutPage');
  return (
    <div className="about_page_wrapper">
      <p>{t('description')}</p>
      <p>{t('author')}</p>
      <Link className="nav-link" href="/">
        <button className="button_red_rounded">{t('home')}</button>
      </Link>
      <Link href="https://rs.school/courses/reactjs" target="_blank">
        <div className="img-logo"></div>
      </Link>
    </div>
  );
}
