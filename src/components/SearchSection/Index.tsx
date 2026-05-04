import { type ChangeEvent, Component, type FormEvent } from 'react';

interface SearchSectionProps {
  searchTerm: string;
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

    this.props.onSearch(trimmedSearchTerm);
  };

  render() {
    return (
      <section className="searchSection">
        <h1>Character Search</h1>

        <form className="searchForm" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="searchInput"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />

          <button type="submit" className="submitButton">
            Search
          </button>
        </form>
      </section>
    );
  }
}
