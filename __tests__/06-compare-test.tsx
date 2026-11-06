import { act, renderHook, waitFor } from '@testing-library/react-native';

import { usePokemon } from '@/data/queries/pokemon';
import { compareBarWidth, compareStats } from '@/lib/compare';

import { bulbasaur, charmander, mockPokeApi, noNetwork, pikachu, squirtle } from './helpers/pokeapi';
import { createGate, createQueryWrapper } from './helpers/query';

describe('Feature 06: Compare', () => {
  it("AC: From Charmander's Detail, Compare → pick Squirtle shows both with six stat rows (the rows; the route to them is on the screen)", () => {
    const { rows } = compareStats(charmander, squirtle);

    expect(rows.map(({ name, left, right }) => [name, left, right])).toEqual([
      ['hp', 39, 44],
      ['attack', 52, 48],
      ['defense', 43, 65],
      ['special-attack', 60, 50],
      ['special-defense', 50, 64],
      ['speed', 65, 43],
    ]);
  });

  it('AC: Per row the higher value is highlighted; the verdict counts wins correctly', () => {
    const { rows, total, verdict } = compareStats(bulbasaur, pikachu);

    expect(rows.map(({ winner }) => winner)).toEqual([
      'left',
      'right',
      'left',
      'left',
      'left',
      'right',
    ]);
    expect(verdict).toBe('Bulbasaur wins 4 of 6 stats');
    // The verdict counts stats won, not the total: Pikachu has the higher total.
    expect(total).toEqual({ left: 318, right: 320, winner: 'right' });
  });

  it('AC: Swap flips both sides and the verdict follows', () => {
    const before = compareStats(bulbasaur, pikachu);
    const after = compareStats(pikachu, bulbasaur);

    expect(after.rows.map(({ left, right }) => [right, left])).toEqual(
      before.rows.map(({ left, right }) => [left, right]),
    );
    expect(after.rows.map(({ winner }) => winner)).toEqual([
      'right',
      'left',
      'right',
      'right',
      'right',
      'left',
    ]);
    expect(after.total).toEqual({ left: 320, right: 318, winner: 'left' });
    expect(after.verdict).toBe('Bulbasaur wins 4 of 6 stats');
  });

  it('AC: Each side has its own loading and error state (one still loads while the other fails, and the retry repairs only that one)', async () => {
    const gate = createGate();
    let rightWorks = false;
    const paths = mockPokeApi(async (path) => {
      if (path === '/pokemon/4') {
        await gate.opened;
        return charmander;
      }
      // With a body: this has to fail on the status, not on JSON that cannot be read.
      return rightWorks ? squirtle : new Response('{}', { status: 500 });
    });
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => ({ left: usePokemon(4), right: usePokemon(7) }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.right.isError).toBe(true));
    expect(result.current.left.isPending).toBe(true);

    gate.open();
    await waitFor(() => expect(result.current.left.data).toEqual(charmander));
    expect(result.current.right.isError).toBe(true);

    rightWorks = true;
    await act(async () => {
      await result.current.right.refetch();
    });

    await waitFor(() => expect(result.current.right.data).toEqual(squirtle));
    expect(paths.filter((path) => path === '/pokemon/4')).toHaveLength(1);
  });

  it('Constraint: The empty slot fetches nothing', async () => {
    const paths = mockPokeApi(() => noNetwork());
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => usePokemon(undefined), { wrapper });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.isError).toBe(false);
    expect(paths).toEqual([]);
  });

  it('AC: Comparing a Pokémon with itself shows all stats equal and "It\'s a tie"', () => {
    const { rows, total, verdict } = compareStats(charmander, charmander);

    expect(rows).toHaveLength(6);
    expect(rows.every(({ winner }) => winner === null)).toBe(true);
    expect(total.winner).toBeNull();
    expect(verdict).toBe("It's a tie");
  });

  it('AC: Charmander vs Squirtle wins 3 each with totals of 309 and 314, and shows "It\'s a tie"', () => {
    const { rows, total, verdict } = compareStats(charmander, squirtle);

    expect(rows.filter(({ winner }) => winner === 'left')).toHaveLength(3);
    expect(rows.filter(({ winner }) => winner === 'right')).toHaveLength(3);
    expect(total).toEqual({ left: 309, right: 314, winner: 'right' });
    expect(verdict).toBe("It's a tie");
  });

  it('Constraint: Bar width = value / 255, so nothing is capped and strong Pokémon stay apart', () => {
    expect(compareBarWidth(51)).toBe('20%');
    expect(compareBarWidth(255)).toBe('100%');
    expect(Number.parseFloat(compareBarWidth(154))).toBeCloseTo(60.39, 2);
  });
});
