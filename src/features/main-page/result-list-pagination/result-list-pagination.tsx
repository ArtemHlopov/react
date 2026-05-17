import type { PaginationProps } from '../../../shared/models';
import { Button } from '../../../shared/components/button/button';
import { apiService } from '../../../shared/services/api/api-service';
import './result-list-pagination.css';
import { Select } from '../../../shared/components/select/select';

export const ResultListPagination = ({
  previous,
  next,
  onOffsetChange,
  onLimitChange,
  total,
  disabled,
  currentPage,
}: PaginationProps) => {
  const defaultPageNumber = 1;
  const paginationOptions = [10, 20, 30];
  const selectOptions = paginationOptions.map((opt) => ({
    title: `${opt}`,
    value: opt,
  }));

  const handlePreviousClick = (): void => {
    if (previous && onOffsetChange) onOffsetChange();
  };

  const handleNextClick = (): void => {
    if (next && onOffsetChange) {
      onOffsetChange(true);
    }
  };

  const handleSelectChange = (value: unknown): void => {
    if (onLimitChange) {
      onLimitChange(
        !isNaN(Number(value)) ? Number(value) : paginationOptions[0]
      );
    }
  };

  return (
    <div className="pagination_wrapper">
      <div className="pagination">
        <span className="pagination_info">Total: {total}</span>
        <div className="pagination_pages_changer">
          <Button
            id="previous-page-btn"
            onClick={handlePreviousClick}
            text="<"
            disabled={disabled || currentPage <= 1}
          />
          {currentPage} / {Math.ceil(Number(total) / apiService.limit) || defaultPageNumber}
          <Button
            id="next-page-btn"
            onClick={handleNextClick}
            text=">"
            disabled={disabled || currentPage >= (Math.ceil(Number(total) / apiService.limit) || defaultPageNumber)}
          />
        </div>
        <Select
          disabled={disabled}
          onSelectChange={handleSelectChange}
          options={selectOptions}
        ></Select>
      </div>
    </div>
  );
};
