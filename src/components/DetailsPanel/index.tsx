import { useEffect, useReducer } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  fetchCharacterDetails,
  type CharacterDetailsData,
} from '../../api/characters';
import styles from './index.module.css';

interface DetailsOutletContext {
  onClose: () => void;
}

interface DetailsState {
  character: CharacterDetailsData | null;
  isLoading: boolean;
  errorMessage: string;
}

type DetailsAction =
  | { type: 'loading' }
  | { type: 'success'; character: CharacterDetailsData }
  | { type: 'error'; message: string };

function detailsReducer(
  state: DetailsState,
  action: DetailsAction
): DetailsState {
  switch (action.type) {
    case 'loading':
      return { character: null, isLoading: true, errorMessage: '' };
    case 'success':
      return {
        character: action.character,
        isLoading: false,
        errorMessage: '',
      };
    case 'error':
      return {
        character: null,
        isLoading: false,
        errorMessage: action.message,
      };
    default:
      return state;
  }
}

const initialDetailsState: DetailsState = {
  character: null,
  isLoading: false,
  errorMessage: '',
};

export function DetailsPanel() {
  const [searchParams] = useSearchParams();
  const { onClose } = useOutletContext<DetailsOutletContext>();
  const detailsId = searchParams.get('details');
  const [{ character, isLoading, errorMessage }, dispatch] = useReducer(
    detailsReducer,
    initialDetailsState
  );

  useEffect(() => {
    if (!detailsId) {
      return;
    }

    let isActive = true;

    async function loadDetails(id: string) {
      dispatch({ type: 'loading' });

      try {
        const nextCharacter = await fetchCharacterDetails(id);

        if (isActive) {
          dispatch({ type: 'success', character: nextCharacter });
        }
      } catch (error) {
        const nextErrorMessage =
          error instanceof Error
            ? error.message
            : 'Character details could not be loaded.';

        if (isActive) {
          dispatch({ type: 'error', message: nextErrorMessage });
        }
      }
    }

    void loadDetails(detailsId);

    return () => {
      isActive = false;
    };
  }, [detailsId]);

  if (!detailsId) {
    return null;
  }

  return (
    <aside className={styles.detailsPanel}>
      <button type="button" className={styles.closeButton} onClick={onClose}>
        Close
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
