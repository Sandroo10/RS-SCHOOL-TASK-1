import type {
  CharacterCardData,
  CharacterDetailsData,
} from '../api/characters';

export const characterCards: CharacterCardData[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    description: 'Human | Alive | Last seen in Citadel of Ricks',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  },
  {
    id: 2,
    name: 'Morty Smith',
    description: 'Human | Alive | Last seen in Earth',
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  },
];

export const characterDetails: CharacterDetailsData = {
  id: 1,
  name: 'Rick Sanchez',
  description: 'Human | Alive | Last seen in Citadel of Ricks',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  origin: 'Earth',
  location: 'Citadel of Ricks',
};
