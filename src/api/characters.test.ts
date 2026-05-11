import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCharacters } from './characters';

type FetchMock = (input: URL) => Promise<Response>;

const apiResponse = {
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
    const calledUrl = fetchMock.mock.calls[0][0];

    expect(calledUrl.searchParams.get('page')).toBe('1');
    expect(calledUrl.searchParams.has('name')).toBe(false);
    expect(characters).toEqual([
      {
        id: 1,
        name: 'Rick Sanchez',
        description: 'Human | Alive | Last seen in Citadel of Ricks',
        image: 'rick.jpeg',
      },
    ]);
  });

  it('includes search term in the request', async () => {
    const fetchMock = vi
      .fn<FetchMock>()
      .mockResolvedValue(
        new Response(JSON.stringify(apiResponse), { status: 200 })
      );
    vi.stubGlobal('fetch', fetchMock);

    await fetchCharacters({ searchTerm: 'morty', page: 1 });
    const calledUrl = fetchMock.mock.calls[0][0];

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
});
