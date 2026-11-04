/**
 * All SQL for favourites. Hooks call these functions, screens never see a query. Values always go in
 * as bound parameters (`?`), never as part of the SQL string.
 */

import { getDatabase } from '@/data/db';
import type { PokemonListItem } from '@/lib/pokemon';

/** Fits `PokemonGrid` as is. The name is stored, so the Favorites list shows without network. */
export type Favorite = PokemonListItem & {
  /** ISO 8601, so sorting the text also sorts by date. */
  addedAt: string;
};

/** `OR IGNORE`: a Pokémon that is already a favourite keeps its original date. */
export async function addFavorite({ id, name }: PokemonListItem): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR IGNORE INTO favorites (id, name, added_at) VALUES (?, ?, ?)',
    id,
    name,
    new Date().toISOString(),
  );
}

export async function removeFavorite(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM favorites WHERE id = ?', id);
}

/** Newest first. */
export async function listFavorites(): Promise<Favorite[]> {
  const db = await getDatabase();
  return db.getAllAsync<Favorite>(
    'SELECT id, name, added_at AS addedAt FROM favorites ORDER BY added_at DESC',
  );
}

export async function isFavorite(id: number): Promise<boolean> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ id: number }>('SELECT id FROM favorites WHERE id = ?', id);
  return row !== null;
}
