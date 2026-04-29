import { Component, type JSX } from 'react';
import type { FilterProps, PokemonListResponse } from '../../shared/models';
import { SearchField } from '../../features/main-page/search-field/search-field';
import { ResultList } from '../../features/main-page/result-list/result-list';
import { LS_FILTER_KEY } from '../../shared/constants';
import { apiService } from '../../shared/services/api/api-service';
import { ResultListPagination } from '../../features/main-page/result-list-pagination/result-list-pagination';
import './main-page.css';

interface MainPageState {
  filter: string;
  data?: PokemonListResponse;
}

export class MainPage extends Component<FilterProps, MainPageState> {
  private abortController: AbortController | null = null;

  constructor(props: FilterProps) {
    super(props);
    this.state = { filter: props.filter || '' };
  }

  componentDidMount(): void {
    this.getList(this.state.filter);
  }

  componentWillUnmount(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  protected readonly handleNewFilter = async (
    value: unknown
  ): Promise<void> => {
    const stringValue = String(value);
    const storageFilter = localStorage.getItem(LS_FILTER_KEY);

    if (stringValue !== storageFilter) {
      localStorage.setItem(LS_FILTER_KEY, stringValue);
      await this.setState({ filter: stringValue });
      await this.getList(stringValue);
    }
  };

  private async getList(filter?: string) {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      const data = await apiService.getItemsList();

      await this.setState({ data });
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        console.log(e);
      }
    } finally {
      console.log(
        `Filter: ${filter}`,
        `StateFilter: ${this.state.filter}`,
        `Storage: ${localStorage.getItem(LS_FILTER_KEY)}`
      );
    }
  }

  protected readonly handleChangePage = async (
    isNextPage: unknown
  ): Promise<void> => {
    if (isNextPage) {
      await apiService.setOffsetValue(apiService.offset + apiService.limit);
    } else {
      await apiService.setOffsetValue(apiService.offset - apiService.limit);
    }
    await this.getList();
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="main_page_wrapper">
        <SearchField
          filter={this.state.filter}
          onFilterChange={this.handleNewFilter}
        />
        <ResultList list={this.state.data?.results || []} />
        <ResultListPagination
          total={this.state.data?.count || 0}
          onOffsetChange={this.handleChangePage}
          next={this.state.data?.next || null}
          previous={this.state.data?.previous || null}
        ></ResultListPagination>
      </div>
    );
  };
}
