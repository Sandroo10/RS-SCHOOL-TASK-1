import { useQuery } from '@tanstack/react-query';
import { fetchCharacterDetails, fetchCharacters } from '../api/characters';

interface UseCharactersQueryParams {
  searchTerm: string;
  page: number;
}

export const characterListQueryKey = (searchTerm: string, page: number) =>
  ['characters', searchTerm, page] as const;

export const characterDetailsQueryKey = (id: string) =>
  ['character-details', id] as const;

export function useCharactersQuery({
  searchTerm,
  page,
}: UseCharactersQueryParams) {
  return useQuery({
    queryKey: characterListQueryKey(searchTerm, page),
    queryFn: () => fetchCharacters({ searchTerm, page }),
  });
}

export function useCharacterDetailsQuery(id: string | null) {
  return useQuery({
    queryKey: characterDetailsQueryKey(id ?? ''),
    queryFn: () => fetchCharacterDetails(id ?? ''),
    enabled: Boolean(id),
  });
}
