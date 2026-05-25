import type { CharacterCardData } from '../../api/characters';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import styles from './index.module.css';

interface CardProps {
  character: CharacterCardData;
  onSelectCharacter?: (id: number) => void;
}

export function Card({ character, onSelectCharacter }: CardProps) {
  const isSelected = useSelectedItemsStore((state) =>
    Boolean(state.selectedItems[character.id])
  );
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const handleCardClick = () => {
    onSelectCharacter?.(character.id);
  };

  const handleCheckboxChange = () => {
    toggleItem(character);
  };

  return (
    <article className={styles.characterCard} onClick={handleCardClick}>
      <label
        className={styles.selectionControl}
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`Select ${character.name}`}
        />
      </label>

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
            onClick={(event) => {
              event.stopPropagation();
              onSelectCharacter(character.id);
            }}
          >
            View details
          </button>
        )}
      </div>
    </article>
  );
}
