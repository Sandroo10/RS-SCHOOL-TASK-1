import { Component } from 'react';
import type { CharacterCardData } from '../../api/characters';
import { Card } from '../Card';
import styles from './index.module.css';

interface CardListProps {
  characters: CharacterCardData[];
}

export class CardList extends Component<CardListProps> {
  render() {
    if (this.props.characters.length === 0) {
      return <p className={styles.emptyResults}>No characters to display.</p>;
    }

    return (
      <div className={styles.cardList}>
        {this.props.characters.map((character) => (
          <Card key={character.id} character={character} />
        ))}
      </div>
    );
  }
}
