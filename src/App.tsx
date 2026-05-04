import { Component } from 'react';
import { SearchSection } from './components/SearchSection';
import { ResultsSection } from './components/ResultsSection';
import { fetchCharacters, type CharacterCardData } from './api/characters';
import styles from './App.module.css';

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

  handleInitialLoad = (searchTerm: string) => {
    this.setState({ searchTerm });
    this.loadCharacters(searchTerm);
  };

  handleSearch = (searchTerm: string) => {
    if (searchTerm === this.state.searchTerm) {
      return;
    }

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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unable to load characters.';

      this.setState({
        characters: [],
        isLoading: false,
        errorMessage,
      });
    }
  };
  render() {
    return (
      <main className={styles.app}>
        <SearchSection
          searchTerm={this.state.searchTerm}
          onInitialLoad={this.handleInitialLoad}
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
