import { createBrowserRouter } from 'react-router';
import App from '../../App';
import { ErrorPage } from '../../pages/error-page/error-page';
import { MainPage } from '../../pages/main-page/main-page';
import { AboutPage } from '../../pages/about-page/about-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainPage filter={''} />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
