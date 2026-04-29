import { Component } from 'react';
import { MainPage } from './pages/main-page/main-page';
import { LS_FILTER_KEY } from './shared/constants';
import { ColumnLayout } from './shared/components/column-layout/column-layout';

export default class Counter extends Component {
  state = {
    filter: localStorage.getItem(LS_FILTER_KEY) || '',
  };

  render() {
    return (
      <>
        <ColumnLayout
          component={<MainPage filter={this.state.filter} />}
        ></ColumnLayout>
      </>
    );
  }
}
