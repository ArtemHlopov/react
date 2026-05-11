import { Component, type JSX } from 'react';
import type { PaginationProps } from '../../../shared/models';
import { Button } from '../../../shared/components/button/button';
import { apiService } from '../../../shared/services/api/api-service';
import './result-list-pagination.css';
import { Select } from '../../../shared/components/select/select';

const PAGINATION_OPTIONS = [10, 20, 30];
export class ResultListPagination extends Component<PaginationProps> {
  protected readonly inputPlaceholder = 'Search pokemon by name';
  protected readonly defaultPageNumber = 1;

  protected readonly handlePreviousClick = (): void => {
    if (this.props.previous && this.props.onOffsetChange)
      this.props.onOffsetChange();
  };

  protected readonly handleNextClick = (): void => {
    if (this.props.next && this.props.onOffsetChange) {
      this.props.onOffsetChange(true);
    }
  };

  protected readonly handleSelectChange = (value: unknown): void => {
    if (this.props.onLimitChange) {
      this.props.onLimitChange(
        !isNaN(Number(value)) ? Number(value) : PAGINATION_OPTIONS[0]
      );
    }
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="pagination_wrapper">
        <div className="pagination">
          <span className="pagination_info">Total: {this.props.total}</span>
          <div className="pagination_pages_changer">
            <Button
              id="previous-page-btn"
              onClick={this.handlePreviousClick}
              text="<"
              disabled={this.props.disabled}
            />
            {Math.floor(apiService.offset / apiService.limit) +
              this.defaultPageNumber}{' '}
            /
            {Math.ceil(Number(this.props.total) / apiService.limit) ||
              this.defaultPageNumber}
            <Button
              id="next-page-btn"
              onClick={this.handleNextClick}
              text=">"
              disabled={this.props.disabled}
            />
          </div>
          <Select
            disabled={this.props.disabled}
            onSelectChange={this.handleSelectChange}
            options={PAGINATION_OPTIONS.map((opt) => ({
              title: `${opt}`,
              value: opt,
            }))}
          ></Select>
        </div>
      </div>
    );
  };
}
