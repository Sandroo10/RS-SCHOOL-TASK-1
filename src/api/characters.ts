const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

export interface CharacterCardData {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface CharacterDetailsData extends CharacterCardData {
  status: string;
  species: string;
  gender: string;
  origin: string;
  location: string;
}

interface ApiCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
  image: string;
}

interface CharactersApiResponse {
  info: {
    pages: number;
  };
  results: ApiCharacter[];
}

interface FetchCharactersParams {
  searchTerm: string;
  page: number;
}

export interface CharactersPageData {
  characters: CharacterCardData[];
  totalPages: number;
}

export async function fetchCharacters({
  searchTerm,
  page,
}: FetchCharactersParams): Promise<CharactersPageData> {
  const url = new URL(API_BASE_URL);

  url.searchParams.set('page', String(page));

  if (searchTerm) {
    url.searchParams.set('name', searchTerm);
  }

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No characters found. Try another name.');
    }

    throw new Error('Characters could not be loaded. Please try again later.');
  }

  const data: CharactersApiResponse = await response.json();

  return {
    characters: data.results.map((character) => ({
      id: character.id,
      name: character.name,
      description: `${character.species} | ${character.status} | Last seen in ${character.location.name}`,
      image: character.image,
    })),
    totalPages: data.info.pages,
  };
}

export async function fetchCharacterDetails(
  id: string
): Promise<CharacterDetailsData> {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Character details could not be loaded.');
  }

  const character: ApiCharacter = await response.json();

  return {
    id: character.id,
    name: character.name,
    description: `${character.species} | ${character.status} | Last seen in ${character.location.name}`,
    image: character.image,
    status: character.status,
    species: character.species,
    gender: character.gender,
    origin: character.origin.name,
    location: character.location.name,
  };
}
