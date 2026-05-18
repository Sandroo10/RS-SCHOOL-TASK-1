import type { CharacterCardData } from '../../api/characters';
import { Card } from '../Card';
import styles from './index.module.css';

interface CardListProps {
  characters: CharacterCardData[];
}

export function CardList({ characters }: CardListProps) {
  if (characters.length === 0) {
    return <p className={styles.emptyResults}>No characters to display.</p>;
  }

  return (
    <div className={styles.cardList}>
      {characters.map((character) => (
        <Card key={character.id} character={character} />
      ))}
    </div>
  );
}
