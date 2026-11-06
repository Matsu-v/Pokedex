import { act, renderHook, waitFor } from '@testing-library/react-native';

import { usePokemonList } from '@/data/queries/pokemon';
import { capitalize, cardImageUrls, formatNumber, spriteUrl } from '@/lib/pokemon';

import { listResponse, mockPokeApi, noNetwork } from './helpers/pokeapi';
import { createGate, createQueryWrapper, dataOf } from './helpers/query';

const IMAGES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** Answers `/pokemon?limit=…&offset=…` as the API does, for a list of `total` Pokémon. */
function answerList(total: number) {
  return (path: string) => {
    const limit = Number(/limit=(\d+)/.exec(path)?.[1]);
    const offset = Number(/offset=(\d+)/.exec(path)?.[1]);
    const ids = Array.from({ length: Math.min(limit, total - offset) }, (_, i) => offset + i + 1);
    const items = ids.map((id) => ({ id, name: id === 1 ? 'bulbasaur' : `pokemon-${id}` }));
    const hasMore = offset + limit < total;
    return listResponse(items, hasMore ? `next page after ${offset + limit}` : null);
  };
}

async function renderList() {
  const { wrapper } = createQueryWrapper();
  const { result } = await renderHook(() => usePokemonList(), { wrapper });
  return result;
}

describe('Feature 01: Browse', () => {
  it('AC: The first 20 Pokémon show with name, number and sprite, starting at Bulbasaur 001', async () => {
    const paths = mockPokeApi(answerList(1351));

    const items = await dataOf(await renderList());

    expect(paths).toEqual(['/pokemon?limit=20&offset=0']);
    expect(items).toHaveLength(20);
    expect(items[0]).toEqual({ id: 1, name: 'bulbasaur' });
    expect(formatNumber(items[0].id)).toBe('001');
    expect(spriteUrl(items[0].id)).toBe(`${IMAGES}/1.png`);
    expect(formatNumber(25)).toBe('025');
    expect(formatNumber(1025)).toBe('1025');
  });

  it('AC: A Pokémon without a sprite shows another image of itself, never an empty box', () => {
    expect(cardImageUrls(10264)).toEqual([
      `${IMAGES}/10264.png`,
      `${IMAGES}/other/official-artwork/10264.png`,
      `${IMAGES}/versions/generation-ix/scarlet-violet/10264.webp`,
    ]);
  });

  it('AC: Scrolling to the end loads the next 20 (the request and the longer list)', async () => {
    const paths = mockPokeApi(answerList(1351));
    const result = await renderList();
    await dataOf(result);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() =>
      expect(result.current.data?.map(({ id }) => id)).toEqual(
        Array.from({ length: 40 }, (_, i) => i + 1),
      ),
    );
    expect(paths).toEqual(['/pokemon?limit=20&offset=0', '/pokemon?limit=20&offset=20']);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('AC: It keeps loading until the end of the list (the last page has no next page)', async () => {
    const paths = mockPokeApi(answerList(25));
    const result = await renderList();
    await dataOf(result);
    expect(result.current.hasNextPage).toBe(true);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data).toHaveLength(25));
    expect(result.current.hasNextPage).toBe(false);
    expect(paths).toHaveLength(2);
  });

  it('AC: First load shows a loading state (pending until the first page is in)', async () => {
    const gate = createGate();
    const answer = answerList(1351);
    mockPokeApi(async (path) => {
      await gate.opened;
      return answer(path);
    });

    const result = await renderList();
    expect(result.current.isPending).toBe(true);

    gate.open();
    await dataOf(result);
    expect(result.current.isPending).toBe(false);
  });

  it('AC: No network shows an error state with a Try again button that refetches (the hook behind it)', async () => {
    let online = false;
    const answer = answerList(1351);
    mockPokeApi((path) => (online ? answer(path) : noNetwork()));

    const result = await renderList();
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();

    online = true;
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toHaveLength(20));
    expect(result.current.isError).toBe(false);
  });

  it('AC: Names start with a capital letter ("Bulbasaur", not "bulbasaur")', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur');
  });
});
