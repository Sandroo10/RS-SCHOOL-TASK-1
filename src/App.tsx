import { Component } from 'react';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';
import { fetchCharacters, type CharacterCardData } from './api/characters';
import './App.css';

const SEARCH_STORAGE_KEY = 'characterSearchTerm';
const FIRST_PAGE = 1;

interface AppState {
  searchTerm: string;
  characters: CharacterCardData[];
  isLoading: boolean;
  errorMessage: string;
}
type AppProps = Record<string, never>;

class App extends Component<AppProps, AppState> {
  state: AppState = {
    searchTerm: '',
    characters: [],
    isLoading: false,
    errorMessage: '',
  };

  componentDidMount() {
    const savedSearchTerm = localStorage.getItem(SEARCH_STORAGE_KEY) ?? '';

    this.setState({ searchTerm: savedSearchTerm });
    this.loadCharacters(savedSearchTerm);
  }

  handleSearch = (searchTerm: string) => {
    if (searchTerm === this.state.searchTerm) {
      return;
    }

    localStorage.setItem(SEARCH_STORAGE_KEY, searchTerm);
    this.setState({ searchTerm });
    this.loadCharacters(searchTerm);
  };

  loadCharacters = async (searchTerm: string) => {
    this.setState({
      isLoading: true,
      errorMessage: '',
    });

    try {
      const characters = await fetchCharacters({
        searchTerm,
        page: FIRST_PAGE,
      });

      this.setState({
        characters,
        isLoading: false,
      });
    } catch {
      this.setState({
        characters: [],
        isLoading: false,
        errorMessage: 'Unable to load characters.',
      });
    }
  };
  render() {
    return (
      <main className="app">
        <SearchSection
          searchTerm={this.state.searchTerm}
          onSearch={this.handleSearch}
        />

        <ResultsSection
          characters={this.state.characters}
          isLoading={this.state.isLoading}
          errorMessage={this.state.errorMessage}
        />
      </main>
    );
  }
}

export default App;
