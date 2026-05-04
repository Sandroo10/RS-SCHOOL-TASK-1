import { Component } from 'react';
import type { CharacterCardData } from '../../api/characters';
import { Card } from '../Card';

interface CardListProps {
  characters: CharacterCardData[];
}

export class CardList extends Component<CardListProps> {
  render() {
    if (this.props.characters.length === 0) {
      return <p className="emptyResults">No characters to display.</p>;
    }

    return (
      <div className="cardList">
        {this.props.characters.map((character) => (
          <Card key={character.id} character={character} />
        ))}
      </div>
    );
  }
}
