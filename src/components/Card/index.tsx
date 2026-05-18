import type { CharacterCardData } from '../../api/characters';
import styles from './index.module.css';

interface CardProps {
  character: CharacterCardData;
  onSelectCharacter?: (id: number) => void;
}

export function Card({ character, onSelectCharacter }: CardProps) {
  return (
    <article className={styles.characterCard}>
      <img
        src={character.image}
        alt={character.name}
        className={styles.characterImage}
      />

      <div>
        <h3>{character.name}</h3>
        <p>{character.description}</p>
        {onSelectCharacter && (
          <button
            type="button"
            className={styles.detailsButton}
            onClick={() => onSelectCharacter(character.id)}
          >
            View details
          </button>
        )}
      </div>
    </article>
  );
}
