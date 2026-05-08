import { Component } from 'react';
import type { CharacterCardData } from '../../api/characters';
import { CardList } from '../CardList';
import { ErrorTestButton } from '../ErrorTestButton';
import styles from './index.module.css';

interface ResultsSectionProps {
  characters: CharacterCardData[];
  isLoading: boolean;
  errorMessage: string;
}

export class ResultsSection extends Component<ResultsSectionProps> {
  render() {
    const { characters, isLoading, errorMessage } = this.props;

    return (
      <section className={styles.resultsSection}>
        <h2>Results Section</h2>

        {isLoading && (
          <div className={styles.loader} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            <span>Loading characters...</span>
          </div>
        )}

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {!isLoading && !errorMessage && <CardList characters={characters} />}

        <ErrorTestButton />
      </section>
    );
  }
}
