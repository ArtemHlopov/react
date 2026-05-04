import { Component, type JSX } from 'react';
import type { FilterProps, PokemonListResponse } from '../../shared/models';
import { SearchField } from '../../features/main-page/search-field/search-field';
import { ResultList } from '../../features/main-page/result-list/result-list';
import { LS_FILTER_KEY } from '../../shared/constants';
import { apiService } from '../../shared/services/api/api-service';
import { ResultListPagination } from '../../features/main-page/result-list-pagination/result-list-pagination';
import pokeballImage from '../../assets/pokeball.png';
import './main-page.css';

interface MainPageState {
  filter: string;
  data?: PokemonListResponse;
  loading: boolean;
  error?: string;
}

export class MainPage extends Component<FilterProps, MainPageState> {
  private abortController: AbortController | null = null;
  private readonly timeoutDuration = 1500;
  private timeout: number | null = null;
  protected readonly defaultErrorMessage = 'Troubles with loading data';

  constructor(props: FilterProps) {
    super(props);
    this.state = {
      filter: props.filter || '',
      loading: false,
    };
  }

  componentDidMount(): void {
    const filter = this.state.filter;
    if (filter) {
      this.getPokemonByName(filter);
    } else {
      this.getList();
    }
  }

  componentWillUnmount(): void {
    this.abortAbortController();
    this.clearTimeout();
  }

  private async clearTimeout(): Promise<void> {
    await this.setState({ loading: false });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private abortAbortController(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private updateAbortController() {
    this.abortAbortController();
    this.abortController = new AbortController();
  }

  protected readonly handleNewFilter = async (
    value: unknown
  ): Promise<void> => {
    const stringValue = String(value).trim();
    const storageFilter = localStorage.getItem(LS_FILTER_KEY);
    if (stringValue !== storageFilter) {
      localStorage.setItem(LS_FILTER_KEY, stringValue);
      await this.setState({ filter: stringValue });
      await this.getPokemonByName(stringValue);
    }
  };

  private async getList() {
    this.updateAbortController();
    await this.setState({ loading: true });

    this.timeout = await setTimeout(async () => {
      try {
        const data = await apiService.getItemsList();

        await this.setState({ data });
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') {
          this.setState({ error: this.defaultErrorMessage });
        }
      } finally {
        await this.clearTimeout();
      }
    }, this.timeoutDuration);
  }

  private async getPokemonByName(name: string): Promise<void> {
    this.updateAbortController();
    await this.setState({ loading: true });

    if (!name.trim()) {
      await this.getList();
      return;
    }

    this.timeout = await setTimeout(async () => {
      this.setState({
        loading: false,
        data: {
          next: this.state.data?.next || null,
          previous: this.state.data?.previous || null,
          count: this.state.data?.count || '',
          results: [{ name, url: apiService.getPokemonLink(name) }],
        },
      });
    }, this.timeoutDuration);
  }

  protected readonly handleChangePage = async (
    isNextPage: unknown
  ): Promise<void> => {
    if (isNextPage) {
      await apiService.setOffsetValue(apiService.offset + apiService.limit);
    } else {
      const newOffset = apiService.offset - apiService.limit;
      if (newOffset >= 0) {
        await apiService.setOffsetValue(newOffset);
      }
    }
    await this.getList();
  };

  protected readonly handleLimitChange = async (
    value: unknown
  ): Promise<void> => {
    if (value && typeof value === 'number') {
      await apiService.setOffsetValue(
        value > apiService.offset ? 0 : apiService.offset - value
      );
      await apiService.setLimitValue(value);
      await this.getList();
    }
  };

  readonly render = (): JSX.Element => {
    return (
      <div className="main_page_wrapper">
        {this.state.loading ? (
          <div className="main_page_loader_overlay">
            <img
              className="main_page_loader_image spin"
              src={pokeballImage}
              alt="Loading pokemon"
            />
          </div>
        ) : null}
        <SearchField
          filter={this.state.filter}
          onFilterChange={this.handleNewFilter}
        />
        <ResultList list={this.state.data?.results || []} />

        <ResultListPagination
          total={this.state.data?.count || ''}
          onOffsetChange={this.handleChangePage}
          onLimitChange={this.handleLimitChange}
          next={this.state.data?.next || null}
          previous={this.state.data?.previous || null}
          disabled={!!this.state.filter}
        ></ResultListPagination>
      </div>
    );
  };
}
