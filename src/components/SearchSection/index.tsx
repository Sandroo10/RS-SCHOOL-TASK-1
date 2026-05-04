import { type ChangeEvent, Component, type FormEvent } from 'react';
import styles from './index.module.css';

const SEARCH_STORAGE_KEY = 'characterSearchTerm';

interface SearchSectionProps {
  searchTerm: string;
  onInitialLoad: (searchTerm: string) => void;
  onSearch: (searchTerm: string) => void;
}

interface SearchSectionState {
  inputValue: string;
}

export class SearchSection extends Component<
  SearchSectionProps,
  SearchSectionState
> {
  state: SearchSectionState = {
    inputValue: this.props.searchTerm,
  };

  componentDidMount() {
    const savedSearchTerm = localStorage.getItem(SEARCH_STORAGE_KEY) ?? '';

    this.setState({ inputValue: savedSearchTerm });
    this.props.onInitialLoad(savedSearchTerm);
  }

  componentDidUpdate(prevProps: SearchSectionProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.setState({ inputValue: this.props.searchTerm });
    }
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearchTerm = this.state.inputValue.trim();

    this.setState({ inputValue: trimmedSearchTerm });

    if (trimmedSearchTerm === this.props.searchTerm) {
      return;
    }

    localStorage.setItem(SEARCH_STORAGE_KEY, trimmedSearchTerm);
    this.props.onSearch(trimmedSearchTerm);
  };

  render() {
    return (
      <section className={styles.searchSection}>
        <h1>Character Search</h1>

        <form className={styles.searchForm} onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />

          <button type="submit" className={styles.submitButton}>
            Search
          </button>
        </form>
      </section>
    );
  }
}
