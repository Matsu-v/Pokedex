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

type FavoriteChange = PokemonListItem & {
  /** What the heart should become. */
  favorite: boolean;
};

/**
 * Writes the target, it does not flip what SQLite has. A flip goes wrong after a failed write: in a
 * double tap the second tap would add the Pokémon again, although the user just emptied the heart.
 */
async function writeFavorite(change: FavoriteChange) {
  if (change.favorite) {
    await addFavorite(change);
  } else {
    await removeFavorite(change.id);
  }
}

/**
 * `toggleFavorite({ id, name })` shows the new state on the heart at once, writes it, and puts the
 * heart back if that fails. The Favorites list is not optimistic: Detail lies over it during the tap,
 * and it reads SQLite again once the writes are done, so it never shows what SQLite does not have.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: favoriteKeys.all,
    mutationFn: writeFavorite,
    // One at a time, in the order of the taps. `onMutate` does not wait for this, only the write does.
    scope: { id: 'favorites' },
    networkMode: 'always',
    onMutate: async ({ id, favorite }) => {
      const key = favoriteKeys.isFavorite(id);
      // A read that is still on its way would put the old state back over the new one.
      await queryClient.cancelQueries({ queryKey: key });
      // `false` if the read has not answered: that is the outline the user saw.
      const previous = queryClient.getQueryData<boolean>(key) ?? false;
      queryClient.setQueryData(key, favorite);
      return { previous };
    },
    onError: (_error, { id }, result) => {
      queryClient.setQueryData(favoriteKeys.isFavorite(id), result?.previous);
    },
    // Also after a failure: SQLite has the last word. `1` is this write, which still counts as pending
    // here. With more to come, a read now would bring the state of this tap back for a moment.
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: favoriteKeys.all }) === 1) {
        return queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
      }
    },
  });

  // From the cache, not from the rendered heart. `onMutate` has already changed the cache when a quick
  // second tap arrives; the screen may not have rendered yet, and would send the same target twice.
  return (pokemon: PokemonListItem) =>
    mutate({
      ...pokemon,
      favorite: !queryClient.getQueryData<boolean>(favoriteKeys.isFavorite(pokemon.id)),
    });
}
