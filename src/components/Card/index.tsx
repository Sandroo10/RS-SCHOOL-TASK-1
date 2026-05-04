import { Component } from 'react';
import type { CharacterCardData } from '../../api/characters';

interface CardProps {
  character: CharacterCardData;
}

export class Card extends Component<CardProps> {
  render() {
    return (
      <div className="characterCard">
        <img
          src={this.props.character.image}
          alt={this.props.character.name}
          className="characterImage"
        />

        <div>
          <h3>{this.props.character.name}</h3>
          <p>{this.props.character.description}</p>
        </div>
      </div>
    );
  }
}
