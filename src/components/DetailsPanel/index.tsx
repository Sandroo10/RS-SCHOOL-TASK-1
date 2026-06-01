import { useQueryClient } from '@tanstack/react-query';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  characterDetailsQueryKey,
  useCharacterDetailsQuery,
} from '../../query/characterQueries';
import styles from './index.module.css';

interface DetailsOutletContext {
  onClose: () => void;
}

export function DetailsPanel() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { onClose } = useOutletContext<DetailsOutletContext>();
  const detailsId = searchParams.get('details');
  const detailsQuery = useCharacterDetailsQuery(detailsId);
  const character = detailsQuery.data ?? null;
  const isLoading = detailsQuery.isPending || detailsQuery.isFetching;
  const errorMessage =
    detailsQuery.error instanceof Error ? detailsQuery.error.message : '';

  const handleRefreshDetails = () => {
    if (detailsId) {
      void queryClient.invalidateQueries({
        queryKey: characterDetailsQueryKey(detailsId),
      });
    }
  };

  if (!detailsId) {
    return null;
  }

  return (
    <aside className={styles.detailsPanel}>
      <button type="button" className={styles.closeButton} onClick={onClose}>
        Close
      </button>
      <button
        type="button"
        className={styles.refreshButton}
        onClick={handleRefreshDetails}
      >
        Refresh details
      </button>

      {isLoading && (
        <div className={styles.loader} role="status" aria-live="polite">
          Loading details...
        </div>
      )}

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {!isLoading && character && (
        <article className={styles.detailsCard}>
          <img src={character.image} alt={character.name} />
          <h2>{character.name}</h2>
          <p>{character.description}</p>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{character.status}</dd>
            </div>
            <div>
              <dt>Species</dt>
              <dd>{character.species}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{character.gender}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>{character.origin}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{character.location}</dd>
            </div>
          </dl>
        </article>
      )}
    </aside>
  );
}
