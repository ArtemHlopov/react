import { Component } from 'react';
import { MainPage } from './pages/main-page/main-page';
import { LS_FILTER_KEY } from './shared/constants';
import { ColumnLayout } from './shared/components/column-layout/column-layout';
import { ErrorBoundary } from './shared/components/error-boundary/error-boundary';

export default class Counter extends Component {
  state = {
    filter: localStorage.getItem(LS_FILTER_KEY) || '',
  };

  render() {
    return (
      <ErrorBoundary
        fallback={<div>Something went wrong. Try to reload the page.</div>}
      >
        <ColumnLayout
          component={<MainPage filter={this.state.filter} />}
        ></ColumnLayout>
      </ErrorBoundary>
    );
  }
}
