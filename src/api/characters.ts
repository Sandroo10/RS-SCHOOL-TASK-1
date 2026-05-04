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
  results: ApiCharacter[];
}

interface FetchCharactersParams {
  searchTerm: string;
  page: number;
}

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
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
    throw new ApiRequestError(
      'Characters could not be loaded. Try another search term.',
      response.status
    );
  }

  const data: CharactersApiResponse = await response.json();

  return data.results.map((character) => ({
    id: character.id,
    name: character.name,
    description: `${character.species} | ${character.status} | Last seen in ${character.location.name}`,
    image: character.image,
  }));
}
