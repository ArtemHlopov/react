import { Component, type JSX } from 'react';
import type { PaginationProps } from '../../../shared/models';
import { Button } from '../../../shared/components/button/button';
import { apiService } from '../../../shared/services/api/api-service';
import './result-list-pagination.css';

export class ResultListPagination extends Component<PaginationProps> {
  protected readonly inputPlaceholder = 'Search pokemon by name';

  protected readonly handlePreviousClick = (): void => {
    if (this.props.previous && this.props.onOffsetChange)
      this.props.onOffsetChange();
  };

  protected readonly handleNextClick = (): void => {
    if (this.props.next && this.props.onOffsetChange) {
      this.props.onOffsetChange(true);
    }
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="pagination_wrapper">
        <div className="pagination">
          <span className="pagination_info">Total: {this.props.total}</span>
          <div className="pagination_pages_changer">
            <Button onClick={this.handlePreviousClick} text="<" />
            {apiService.offset / apiService.limit + 1} /
            {Math.ceil(this.props.total / apiService.limit)}
            <Button onClick={this.handleNextClick} text=">" />
          </div>
        </div>
      </div>
    );
  };
}
