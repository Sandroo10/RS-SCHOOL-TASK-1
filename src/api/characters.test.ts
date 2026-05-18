import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCharacterDetails, fetchCharacters } from './characters';

type FetchMock = (input: string | URL) => Promise<Response>;

const apiResponse = {
  info: {
    pages: 42,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      location: {
        name: 'Citadel of Ricks',
      },
      image: 'rick.jpeg',
    },
  ],
};

describe('fetchCharacters', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and maps the first page of characters', async () => {
    const fetchMock = vi
      .fn<FetchMock>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), { status: 200 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const characters = await fetchCharacters({ searchTerm: '', page: 1 });
    const calledUrl = fetchMock.mock.calls[0][0] as URL;

    expect(calledUrl.searchParams.get('page')).toBe('1');
    expect(calledUrl.searchParams.has('name')).toBe(false);
    expect(characters).toEqual({
      characters: [
        {
          id: 1,
          name: 'Rick Sanchez',
          description: 'Human | Alive | Last seen in Citadel of Ricks',
          image: 'rick.jpeg',
        },
      ],
      totalPages: 42,
    });
  });

  it('includes search term in the request', async () => {
    const fetchMock = vi
      .fn<FetchMock>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), { status: 200 })
      );
    vi.stubGlobal('fetch', fetchMock);

    await fetchCharacters({ searchTerm: 'morty', page: 1 });
    const calledUrl = fetchMock.mock.calls[0][0] as URL;

    expect(calledUrl.searchParams.get('name')).toBe('morty');
    expect(calledUrl.searchParams.get('page')).toBe('1');
  });

  it('throws readable not found error for 404 responses', async () => {
    const fetchMock = vi
      .fn<FetchMock>()
      .mockResolvedValue(new Response(null, { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchCharacters({ searchTerm: 'missing', page: 1 })
    ).rejects.toThrow('No characters found. Try another name.');
  });

  it('throws readable general error for other failed responses', async () => {
    const fetchMock = vi
      .fn<FetchMock>()
      .mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchCharacters({ searchTerm: 'rick', page: 1 })
    ).rejects.toThrow(
      'Characters could not be loaded. Please try again later.'
    );
  });

  it('fetches and maps character details', async () => {
    const fetchMock = vi.fn<FetchMock>().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
          origin: { name: 'Earth' },
          location: { name: 'Citadel of Ricks' },
          image: 'rick.jpeg',
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const details = await fetchCharacterDetails('1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1'
    );
    expect(details).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      description: 'Human | Alive | Last seen in Citadel of Ricks',
      image: 'rick.jpeg',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: 'Earth',
      location: 'Citadel of Ricks',
    });
  });

  it('throws readable error when details request fails', async () => {
    const fetchMock = vi
      .fn<FetchMock>()
      .mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchCharacterDetails('1')).rejects.toThrow(
      'Character details could not be loaded.'
    );
  });
});
