import { Component } from 'react';
import type { CharacterCardData } from '../../api/characters';
import styles from './index.module.css';

interface CardProps {
  character: CharacterCardData;
}

export class Card extends Component<CardProps> {
  render() {
    return (
      <div className={styles.characterCard}>
        <img
          src={this.props.character.image}
          alt={this.props.character.name}
          className={styles.characterImage}
        />

        <div>
          <h3>{this.props.character.name}</h3>
          <p>{this.props.character.description}</p>
        </div>
      </div>
    );
  }
}
