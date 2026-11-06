import { onlineManager } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { addFavorite, listFavorites } from '@/data/favorites-repository';
import { useFavorites, useIsFavorite, useToggleFavorite } from '@/data/queries/favorites';

import { mockPokeApi, noNetwork } from './helpers/pokeapi';
import { createGate, createQueryWrapper } from './helpers/query';

/**
 * `expo-sqlite` needs a phone, so Node's own SQLite stands in for it, in memory: the SQL in `db.ts` and the
 * repository really runs. Every Node that Expo SDK 58 supports has it. What this cannot show is that the file
 * survives on a real phone.
 */
type Row = Record<string, unknown>;
type NodeSqlite = {
  DatabaseSync: new (path: string) => {
    exec(sql: string): void;
    prepare(sql: string): {
      get(...params: unknown[]): Row | undefined;
      all(...params: unknown[]): Row[];
      run(...params: unknown[]): unknown;
    };
  };
};

const { DatabaseSync } = jest.requireActual<NodeSqlite>('node:sqlite');

/** The database of one phone: it survives a restart of the app. Plus switches to make it wait or fail. */
function newPhone() {
  return {
    database: new DatabaseSync(':memory:'),
    opens: 0,
    migrationSteps: 0,
    writesStarted: 0,
    failNextOpen: false,
    failNextList: false,
    failNextWrite: false,
    writeGate: Promise.resolve(),
    readGate: Promise.resolve(),
  };
}

let phone = newPhone();

/** The part of `expo-sqlite` the app uses. It looks up `phone` per call, because a test gets a new one. */
const mockOpenDatabase = async () => {
  phone.opens += 1;
  if (phone.failNextOpen) {
    phone.failNextOpen = false;
    throw new Error('Could not open the database');
  }
  return {
    async getFirstAsync(sql: string, ...params: unknown[]) {
      await phone.readGate;
      return phone.database.prepare(sql).get(...params) ?? null;
    },
    async getAllAsync(sql: string, ...params: unknown[]) {
      if (phone.failNextList) {
        phone.failNextList = false;
        throw new Error('Could not read the favourites');
      }
      return phone.database.prepare(sql).all(...params);
    },
    async runAsync(sql: string, ...params: unknown[]) {
      phone.writesStarted += 1;
      await phone.writeGate;
      if (phone.failNextWrite) {
        phone.failNextWrite = false;
        throw new Error('Could not write the favourite');
      }
      phone.database.prepare(sql).run(...params);
    },
    async execAsync(sql: string) {
      phone.migrationSteps += 1;
      phone.database.exec(sql);
    },
  };
};

jest.mock('expo-sqlite', () => ({ openDatabaseAsync: () => mockOpenDatabase() }));

const PIKACHU = { id: 25, name: 'pikachu' };
const BULBASAUR = { id: 1, name: 'bulbasaur' };

/** What is really in the table, without going through the code under test. */
function storedIds() {
  return phone.database
    .prepare('SELECT id FROM favorites ORDER BY id')
    .all()
    .map(({ id }) => id);
}

/** What Detail and the Favorites tab run: the state of the heart, the list, and the toggle. */
async function renderHeart() {
  const { queryClient, wrapper } = createQueryWrapper();
  const { result } = await renderHook(
    () => ({
      isFavorite: useIsFavorite(PIKACHU.id),
      list: useFavorites(),
      toggle: useToggleFavorite(),
    }),
    { wrapper },
  );
  await waitFor(() => expect(result.current.isFavorite.isSuccess).toBe(true));
  await waitFor(() => expect(result.current.list.isSuccess).toBe(true));

  async function tap() {
    await act(async () => result.current.toggle(PIKACHU));
  }

  /** Two taps in separate ticks, as on a phone, with the first write still on its way. */
  async function doubleTap() {
    await act(async () => {
      result.current.toggle(PIKACHU);
      await new Promise((resolve) => setTimeout(resolve, 0));
      result.current.toggle(PIKACHU);
    });
  }

  const writesDone = () => waitFor(() => expect(queryClient.isMutating()).toBe(0));

  return { result, tap, doubleTap, writesDone };
}

/** A new start of the app: new module instances, on the same phone. */
function restartApp() {
  jest.resetModules();
  return {
    db: jest.requireActual<typeof import('@/data/db')>('@/data/db'),
    repository: jest.requireActual<typeof import('@/data/favorites-repository')>(
      '@/data/favorites-repository',
    ),
  };
}

describe('Feature 04: Favorites', () => {
  beforeEach(async () => {
    phone = newPhone();
    // The table comes from the real migration, as at app start.
    await restartApp().db.getDatabase();
  });

  afterEach(() => {
    onlineManager.setOnline(true);
  });

  it('AC: Tapping the heart on Detail fills it and the Pokémon appears in Favorites', async () => {
    const { result, tap } = await renderHeart();
    expect(result.current.isFavorite.data).toBe(false);

    await tap();

    await waitFor(() => expect(result.current.isFavorite.data).toBe(true));
    await waitFor(() =>
      expect(result.current.list.data?.map(({ id, name }) => ({ id, name }))).toEqual([PIKACHU]),
    );
    expect(storedIds()).toEqual([PIKACHU.id]);
  });

  it('AC: Tapping it again empties it and the Pokémon disappears from Favorites (and no other)', async () => {
    await addFavorite(BULBASAUR);
    const { result, tap } = await renderHeart();
    await tap();
    await waitFor(() => expect(result.current.list.data).toHaveLength(2));

    await tap();

    await waitFor(() => expect(result.current.isFavorite.data).toBe(false));
    await waitFor(() =>
      expect(result.current.list.data?.map(({ name }) => name)).toEqual([BULBASAUR.name]),
    );
    expect(storedIds()).toEqual([BULBASAUR.id]);
  });

  it('AC: The heart changes at once, before the write to SQLite is done', async () => {
    const writes = createGate();
    phone.writeGate = writes.opened;
    const { result, tap, writesDone } = await renderHeart();

    await tap();
    await waitFor(() => expect(result.current.isFavorite.data).toBe(true));
    expect(storedIds()).toEqual([]);

    writes.open();
    await writesDone();
    expect(storedIds()).toEqual([PIKACHU.id]);
    await waitFor(() => expect(result.current.list.data).toHaveLength(1));
  });

  it('AC: If the write fails, the heart goes back, and Favorites agrees with it', async () => {
    const writes = createGate();
    phone.writeGate = writes.opened;
    phone.failNextWrite = true;
    const { result, tap, writesDone } = await renderHeart();

    // The read after the write has to wait, so only the rollback can put the heart back.
    const reads = createGate();
    phone.readGate = reads.opened;

    await tap();
    await waitFor(() => expect(result.current.isFavorite.data).toBe(true));

    writes.open();
    await waitFor(() => expect(result.current.isFavorite.data).toBe(false));

    reads.open();
    await writesDone();
    expect(result.current.isFavorite.data).toBe(false);
    expect(result.current.list.data).toEqual([]);
    expect(storedIds()).toEqual([]);
  });

  it('AC: A double tap ends where the last tap points (and the writes run one at a time)', async () => {
    const writes = createGate();
    phone.writeGate = writes.opened;
    const { result, doubleTap, writesDone } = await renderHeart();

    await doubleTap();
    // Long enough for a second write to start, if it did not wait for the first.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(phone.writesStarted).toBe(1);

    writes.open();
    await writesDone();

    expect(phone.writesStarted).toBe(2);
    expect(storedIds()).toEqual([]);
    await waitFor(() => expect(result.current.isFavorite.data).toBe(false));
  });

  it('AC: A double tap ends where the last tap points, also if the first write fails', async () => {
    const writes = createGate();
    phone.writeGate = writes.opened;
    phone.failNextWrite = true;
    const { result, doubleTap, writesDone } = await renderHeart();

    // The first write fails only after the second tap. Before that it is one tap, and a new one.
    await doubleTap();
    writes.open();
    await writesDone();

    expect(storedIds()).toEqual([]);
    await waitFor(() => expect(result.current.isFavorite.data).toBe(false));
    await waitFor(() => expect(result.current.list.data).toEqual([]));
  });

  it('AC: After fully closing and reopening the app, the favourites are still there (a new start keeps the rows; the real file is a phone check)', async () => {
    await addFavorite(PIKACHU);

    const { repository } = restartApp();

    expect((await repository.listFavorites()).map(({ name }) => name)).toEqual([PIKACHU.name]);
    expect(await repository.isFavorite(PIKACHU.id)).toBe(true);
  });

  it('AC: Empty Favorites shows a short message with a hint to tap the heart (an empty table is an empty list, not an error; the message is on the screen)', async () => {
    const { result } = await renderHeart();

    expect(result.current.list.isError).toBe(false);
    expect(result.current.list.data).toEqual([]);
  });

  it('AC: The Favorites list shows without network (name and number come from SQLite)', async () => {
    const paths = mockPokeApi(() => noNetwork());
    await addFavorite(PIKACHU);
    onlineManager.setOnline(false);

    const { result, tap } = await renderHeart();
    expect(result.current.list.data?.map(({ id, name }) => ({ id, name }))).toEqual([PIKACHU]);

    // The heart works without network too.
    await tap();
    await waitFor(() => expect(result.current.list.data).toEqual([]));

    expect(paths).toEqual([]);
  });

  it('Constraint: Newest first', async () => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValueOnce('2026-11-01T10:00:00.000Z')
      .mockReturnValueOnce('2026-11-03T10:00:00.000Z')
      .mockReturnValueOnce('2026-11-02T10:00:00.000Z');

    await addFavorite(BULBASAUR);
    await addFavorite({ id: 4, name: 'charmander' });
    await addFavorite({ id: 7, name: 'squirtle' });

    expect(await listFavorites()).toEqual([
      { id: 4, name: 'charmander', addedAt: '2026-11-03T10:00:00.000Z' },
      { id: 7, name: 'squirtle', addedAt: '2026-11-02T10:00:00.000Z' },
      { id: 1, name: 'bulbasaur', addedAt: '2026-11-01T10:00:00.000Z' },
    ]);
  });

  it('Constraint: A Pokémon that is already a favourite keeps its original date', async () => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValueOnce('2026-11-01T10:00:00.000Z')
      .mockReturnValueOnce('2026-11-02T10:00:00.000Z');

    await addFavorite(PIKACHU);
    await addFavorite(PIKACHU);

    expect(await listFavorites()).toEqual([{ ...PIKACHU, addedAt: '2026-11-01T10:00:00.000Z' }]);
  });

  it('Constraint: Table `favorites (id INTEGER PRIMARY KEY, name TEXT NOT NULL, added_at TEXT NOT NULL)`; the migration runs at app start, once per phone', async () => {
    phone = newPhone();

    const firstStart = restartApp();
    firstStart.db.prepareDatabase();
    await firstStart.db.getDatabase();

    expect(phone.opens).toBe(1);
    expect(phone.database.prepare('PRAGMA user_version').get()).toEqual({ user_version: 1 });
    expect(
      phone.database
        .prepare('PRAGMA table_info(favorites)')
        .all()
        .map(({ name, type, notnull, pk }) => [name, type, notnull, pk]),
    ).toEqual([
      ['id', 'INTEGER', 0, 1],
      ['name', 'TEXT', 1, 0],
      ['added_at', 'TEXT', 1, 0],
    ]);

    phone.migrationSteps = 0;
    const secondStart = restartApp();
    await secondStart.db.getDatabase();

    expect(phone.migrationSteps).toBe(0);
  });

  it('Rule: The Favorites list has an error state with Try again (the hook behind it)', async () => {
    phone.failNextList = true;
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => useFavorites(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toEqual([]));
    expect(result.current.isError).toBe(false);
  });

  it('Rule: After a failed open, Try again opens the database again', async () => {
    phone = newPhone();
    phone.failNextOpen = true;

    const { db } = restartApp();

    await expect(db.getDatabase()).rejects.toThrow('Could not open the database');
    await expect(db.getDatabase()).resolves.toBeDefined();
    expect(phone.opens).toBe(2);
  });
});
