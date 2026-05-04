const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

export interface CharacterCardData {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface ApiCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  location: {
    name: string;
  };
  image: string;
}

interface CharactersApiResponse {
  results: ApiCharacter[];
}

interface FetchCharactersParams {
  searchTerm: string;
  page: number;
}

export async function fetchCharacters({
  searchTerm,
  page,
}: FetchCharactersParams): Promise<CharacterCardData[]> {
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

  return data.results.map((character) => ({
    id: character.id,
    name: character.name,
    description: `${character.species} | ${character.status} | Last seen in ${character.location.name}`,
    image: character.image,
  }));
}
