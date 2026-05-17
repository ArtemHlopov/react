import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultListPagination } from './result-list-pagination';
import { apiService } from '../../../shared/services/api/api-service';

describe('ResultListPagination', () => {
  beforeEach(() => {
    apiService.setOffsetValue(20);
    apiService.setLimitValue(10);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders total count and current page info', () => {
    const { container } = render(
      <ResultListPagination
        total={95}
        next="next-page"
        previous="previous-page"
        disabled={false}
        currentPage={3}
      />
    );

    expect(screen.getByText('Total: 95')).toBeInTheDocument();
    expect(container).toHaveTextContent('3 / 10');
  });

  it('calls the previous page callback when a previous page exists', async () => {
    const user = userEvent.setup();
    const onOffsetChange = vi.fn();

    render(
      <ResultListPagination
        total={95}
        next="next-page"
        previous="previous-page"
        disabled={false}
        onOffsetChange={onOffsetChange}
        currentPage={3}
      />
    );

    await user.click(screen.getByRole('button', { name: '<' }));

    expect(onOffsetChange).toHaveBeenCalledTimes(1);
    expect(onOffsetChange).toHaveBeenCalledWith();
  });

  it('calls the next page callback with true when a next page exists', async () => {
    const user = userEvent.setup();
    const onOffsetChange = vi.fn();

    render(
      <ResultListPagination
        total={95}
        next="next-page"
        previous="previous-page"
        disabled={false}
        onOffsetChange={onOffsetChange}
        currentPage={3}
      />
    );

    await user.click(screen.getByRole('button', { name: '>' }));

    expect(onOffsetChange).toHaveBeenCalledTimes(1);
    expect(onOffsetChange).toHaveBeenCalledWith(true);
  });

  it('does not change pages when next and previous links are missing', async () => {
    const user = userEvent.setup();
    const onOffsetChange = vi.fn();

    render(
      <ResultListPagination
        total={95}
        next={null}
        previous={null}
        disabled={false}
        onOffsetChange={onOffsetChange}
        currentPage={3}
      />
    );

    await user.click(screen.getByRole('button', { name: '<' }));
    await user.click(screen.getByRole('button', { name: '>' }));

    expect(onOffsetChange).not.toHaveBeenCalled();
  });

  it('calls the limit callback with the selected numeric value', async () => {
    const user = userEvent.setup();
    const onLimitChange = vi.fn();

    render(
      <ResultListPagination
        total={95}
        next="next-page"
        previous="previous-page"
        disabled={false}
        onLimitChange={onLimitChange}
        currentPage={3}
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), '20');

    expect(onLimitChange).toHaveBeenCalledTimes(1);
    expect(onLimitChange).toHaveBeenCalledWith(20);
  });

  it('disables the controls when pagination is disabled', () => {
    render(
      <ResultListPagination
        total={95}
        next="next-page"
        previous="previous-page"
        disabled={true}
        currentPage={3}
      />
    );

    expect(screen.getByRole('button', { name: '<' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '>' })).toBeDisabled();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
