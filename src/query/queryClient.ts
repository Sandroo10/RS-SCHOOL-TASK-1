import { QueryClient } from '@tanstack/react-query';

const DEFAULT_QUERY_CACHE_TTL_MS = 300_000;

export function getQueryCacheTtl() {
  const configuredCacheTtl = Number(import.meta.env.VITE_QUERY_CACHE_TTL_MS);

  return Number.isFinite(configuredCacheTtl) && configuredCacheTtl > 0
    ? configuredCacheTtl
    : DEFAULT_QUERY_CACHE_TTL_MS;
}

export function createAppQueryClient() {
  const cacheTtl = getQueryCacheTtl();

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: cacheTtl,
        gcTime: cacheTtl,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}
