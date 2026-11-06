import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAllPokemonNames } from '@/data/queries/pokemon';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { filterPokemon } from '@/lib/pokemon';

import { listResponse, mockPokeApi, noNetwork, routes } from './helpers/pokeapi';
import { createGate, createQueryWrapper, dataOf } from './helpers/query';

/** Real names and numbers, in number order, as the API gives them. */
const ITEMS = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 5, name: 'charmeleon' },
  { id: 6, name: 'charizard' },
  { id: 25, name: 'pikachu' },
  { id: 26, name: 'raichu' },
  { id: 66, name: 'machop' },
  { id: 150, name: 'mewtwo' },
];

const ALL_NAMES_PATH = '/pokemon?limit=100000&offset=0';
const PIKACHU = { id: 25, name: 'pikachu' };

describe('Feature 02: Search', () => {
  it('AC: "pika", "PIKA" and "Pika" all find Pikachu', () => {
    for (const text of ['pika', 'PIKA', 'Pika']) {
      expect(filterPokemon(ITEMS, text)).toEqual([PIKACHU]);
    }
  });

  it('AC: A Pokémon that has not been scrolled to in Browse is found too ("mewtwo" right after starting the app)', async () => {
    const paths = mockPokeApi(routes({ [ALL_NAMES_PATH]: listResponse(ITEMS) }));
    const { wrapper } = createQueryWrapper();

    const first = await renderHook(() => useAllPokemonNames(), { wrapper });
    const names = await dataOf(first.result);

    expect(filterPokemon(names, 'mewtwo')).toEqual([{ id: 150, name: 'mewtwo' }]);

    // A second visit to Search uses the same list: the whole list is fetched only once.
    const second = await renderHook(() => useAllPokemonNames(), { wrapper });
    await dataOf(second.result);
    expect(paths).toEqual([ALL_NAMES_PATH]);
  });

  it('AC: "Ch" shows Charmander, Charmeleon, Charizard, Pikachu … in number order', () => {
    expect(filterPokemon(ITEMS, 'Ch').map(({ name }) => name)).toEqual([
      'charmander',
      'charmeleon',
      'charizard',
      'pikachu',
      'raichu',
      'machop',
    ]);
  });

  it('AC: "25" shows Pikachu', () => {
    expect(filterPokemon(ITEMS, '25')).toEqual([PIKACHU]);
  });

  it('Constraint: The number equals the text (`4`, `004`)', () => {
    const charmander = [{ id: 4, name: 'charmander' }];

    expect(filterPokemon(ITEMS, '4')).toEqual(charmander);
    expect(filterPokemon(ITEMS, '004')).toEqual(charmander);
  });

  it('AC: Empty field shows no results and no error', () => {
    expect(filterPokemon(ITEMS, '')).toEqual([]);
    expect(filterPokemon(ITEMS, '   ')).toEqual([]);
  });

  it('AC: No match shows "No Pokémon found for “xyz”" (the filter finds nothing; the sentence is on the screen)', () => {
    expect(filterPokemon(ITEMS, 'xyz')).toEqual([]);
  });

  it('AC: While the name list loads: loading state (the hook behind it)', async () => {
    const gate = createGate();
    mockPokeApi(async () => {
      await gate.opened;
      return listResponse(ITEMS);
    });
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => useAllPokemonNames(), { wrapper });
    expect(result.current.isPending).toBe(true);

    gate.open();
    expect(await dataOf(result)).toEqual(ITEMS);
  });

  it('AC: When it fails: error state with Try again (the hook behind it)', async () => {
    let online = false;
    mockPokeApi(() => (online ? listResponse(ITEMS) : noNetwork()));
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => useAllPokemonNames(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));

    online = true;
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toEqual(ITEMS));
    expect(result.current.isError).toBe(false);
  });

  describe('Constraint: Debounce the input by ~250 ms', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('changes only when the text has stayed the same for the delay', async () => {
      const { result, rerender } = await renderHook(
        ({ text }: { text: string }) => useDebouncedValue(text, 250),
        { initialProps: { text: '' } },
      );

      await rerender({ text: 'pi' });
      await act(async () => {
        jest.advanceTimersByTime(249);
      });
      expect(result.current).toBe('');

      // Typing on starts the wait again.
      await rerender({ text: 'pika' });
      await act(async () => {
        jest.advanceTimersByTime(249);
      });
      expect(result.current).toBe('');

      await act(async () => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toBe('pika');
    });
  });
});
