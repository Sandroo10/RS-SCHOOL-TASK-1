import { Component } from 'react';
import type { CharacterCardData } from '../../api/characters';
import { CardList } from '../CardList';

interface ResultsSectionProps {
  characters: CharacterCardData[];
  isLoading: boolean;
  errorMessage: string;
}

export class ResultsSection extends Component<ResultsSectionProps> {
  render() {
    const { characters, isLoading, errorMessage } = this.props;

    return (
      <section className="resultsSection">
        <h2>Results Section</h2>

        {isLoading && <p className="loadingMessage">Loading characters...</p>}

        {errorMessage && <p className="errorMessage">{errorMessage}</p>}

        {!isLoading && !errorMessage && <CardList characters={characters} />}
      </section>
    );
  }
}
