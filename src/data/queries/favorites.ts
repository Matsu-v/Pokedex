/**
 * TanStack Query hooks for favourites. Screens use these, never the repository directly.
 *
 * SQLite is on the phone, so everything here has `networkMode: 'always'`: by default TanStack pauses
 * work while offline, and the Favorites list has to show without network.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addFavorite,
  isFavorite,
  listFavorites,
  removeFavorite,
} from '@/data/favorites-repository';
import type { PokemonListItem } from '@/lib/pokemon';

export const favoriteKeys = {
  all: ['favorites'] as const,
  list: ['favorites', 'list'] as const,
  isFavorite: (id: number) => ['favorites', 'is-favorite', id] as const,
};

/** All favourites, newest first. */
export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.list,
    queryFn: listFavorites,
    networkMode: 'always',
  });
}

export function useIsFavorite(id: number) {
  return useQuery({
    queryKey: favoriteKeys.isFavorite(id),
    queryFn: () => isFavorite(id),
    networkMode: 'always',
  });
}

/** Reads the current state from SQLite, not from the cache, which can be behind. */
async function toggleFavorite(pokemon: PokemonListItem) {
  if (await isFavorite(pokemon.id)) {
    await removeFavorite(pokemon.id);
  } else {
    await addFavorite(pokemon);
  }
}

/** `mutate({ id, name })` adds the Pokémon or removes it, and refreshes every list and heart. */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    // One at a time. In parallel, a double tap would read "not a favourite" twice and add it twice.
    scope: { id: 'favorites' },
    networkMode: 'always',
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoriteKeys.all }),
  });
}
