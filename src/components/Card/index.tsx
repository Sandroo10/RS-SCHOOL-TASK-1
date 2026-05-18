import type { CharacterCardData } from '../../api/characters';
import styles from './index.module.css';

interface CardProps {
  character: CharacterCardData;
}

export function Card({ character }: CardProps) {
  return (
    <div className={styles.characterCard}>
      <img
        src={character.image}
        alt={character.name}
        className={styles.characterImage}
      />

      <div>
        <h3>{character.name}</h3>
        <p>{character.description}</p>
      </div>
    </div>
  );
}
