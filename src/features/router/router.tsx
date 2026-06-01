import { createBrowserRouter } from 'react-router';
import App from '../../App';
import { ErrorPage } from '../../pages/error-page/error-page';
import { MainPage } from '../../pages/main-page/main-page';
import { AboutPage } from '../../pages/about-page/about-page';
import { DetailsPanel } from '../main-page/details-panel/details-panel';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainPage filter={''} />,
        children: [
          {
            path: 'details/:name',
            element: <DetailsPanel />,
          },
        ],
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
