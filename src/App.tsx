import { MainPage } from './pages/main-page/main-page';
import { LS_FILTER_KEY } from './shared/constants';
import { ColumnLayout } from './shared/components/column-layout/column-layout';
import { ErrorBoundary } from './shared/components/error-boundary/error-boundary';

const App = () => {
  const filter = localStorage.getItem(LS_FILTER_KEY) || '';

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Try to reload the page.</div>}
    >
      <ColumnLayout component={<MainPage filter={filter} />}></ColumnLayout>
    </ErrorBoundary>
  );
};

export default App;
