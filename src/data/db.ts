/**
 * The only place that opens the database. Everything that reads or writes goes through `getDatabase`,
 * so nothing can run before the migrations are done.
 */

import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const DATABASE_NAME = 'pokedex.db';
const DATABASE_VERSION = 1;

/** Runs the steps this phone has not had yet. SQLite keeps `user_version` in the database file. */
async function migrate(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;
  if (version >= DATABASE_VERSION) return;

  if (version === 0) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        added_at TEXT NOT NULL
      );
    `);
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

async function openAndMigrate() {
  const db = await openDatabaseAsync(DATABASE_NAME);
  await migrate(db);
  return db;
}

let database: Promise<SQLiteDatabase> | null = null;

/**
 * The one open database, migrated. A failed open is forgotten, otherwise "Try again" would get the
 * same rejected promise forever.
 */
export function getDatabase(): Promise<SQLiteDatabase> {
  if (!database) {
    database = openAndMigrate().catch((error) => {
      database = null;
      throw error;
    });
  }
  return database;
}

/**
 * Runs the migrations at app start. A failure is not fatal and is dropped here: the next favourites
 * query opens the database again and shows the error with Try again.
 */
export function prepareDatabase(): void {
  getDatabase().catch(() => {});
}
