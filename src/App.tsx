import { Outlet } from 'react-router-dom';
import { ColumnLayout } from './shared/components/column-layout/column-layout';
import { ErrorBoundary } from './shared/components/error-boundary/error-boundary';

const App = () => {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Try to reload the page.</div>}
    >
      <ColumnLayout>
        <Outlet />
      </ColumnLayout>
    </ErrorBoundary>
  );
};

export default App;
