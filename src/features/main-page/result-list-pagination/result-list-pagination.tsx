'use client';
import type { PaginationProps } from '../../../shared/models';
import { Button } from '../../../shared/components/button/button';
import './result-list-pagination.css';
import { Select } from '../../../shared/components/select/select';
import { DarkThemeContext } from '../../../shared/context/appThemeContext';
import { useContext } from 'react';
import { usePagination } from '../../../shared/hooks/use-pagination';

export const ResultListPagination = ({
  previous,
  next,
  total,
  disabled,
}: PaginationProps) => {
  const defaultPageNumber = 1;
  const paginationOptions = [10, 20, 30];
  const selectOptions = paginationOptions.map((opt) => ({
    title: `${opt}`,
    value: opt,
  }));
  const { isDarkTheme } = useContext(DarkThemeContext);
  const { currentPage, setPage, currentLimit, setLimit } = usePagination();

  const handlePreviousClick = (): void => {
    if (previous) setPage(Math.max(1, currentPage - 1));
  };

  const handleNextClick = (): void => {
    if (next) {
      setPage(currentPage + 1);
    }
  };

  const totalPages = Math.ceil(
    Number(total) / currentLimit || defaultPageNumber
  );

  const handleSelectChange = (value: unknown): void => {
    const number = Number(value);
    if (!isNaN(number)) {
      setLimit(number);
    }
  };

  return (
    <div className="pagination_wrapper">
      <div className={`pagination ${isDarkTheme ? 'pagination__dark' : ''}`}>
        <span className="pagination_info">Total: {total}</span>
        <div className="pagination_pages_changer">
          <Button
            id="previous-page-btn"
            onClick={handlePreviousClick}
            text="<"
            disabled={disabled || currentPage <= 1}
          />
          {currentPage} /{totalPages}
          <Button
            id="next-page-btn"
            onClick={handleNextClick}
            text=">"
            disabled={disabled || currentPage >= totalPages}
          />
        </div>
        <Select
          disabled={disabled}
          onSelectChange={handleSelectChange}
          options={selectOptions}
          value={currentLimit}
        ></Select>
      </div>
    </div>
  );
};
