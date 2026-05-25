import type { CharacterCardData } from '../../api/characters';
import { CardList } from '../CardList';
import { ErrorTestButton } from '../ErrorTestButton';
import styles from './index.module.css';

interface ResultsSectionProps {
  characters: CharacterCardData[];
  isLoading: boolean;
  errorMessage: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectCharacter: (id: number) => void;
}

export function ResultsSection({
  characters,
  isLoading,
  errorMessage,
  currentPage,
  totalPages,
  onPageChange,
  onSelectCharacter,
}: ResultsSectionProps) {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

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

      {!isLoading && !errorMessage && (
        <>
          <CardList
            characters={characters}
            onSelectCharacter={onSelectCharacter}
          />

          {characters.length > 0 && (
            <nav className={styles.pagination} aria-label="Pagination">
              <button
                type="button"
                disabled={!canGoBack}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={!canGoForward}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      <ErrorTestButton />
    </section>
  );
}
