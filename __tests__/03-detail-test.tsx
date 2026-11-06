import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useEvolutionStages, usePokemon } from '@/data/queries/pokemon';
import {
  capitalize,
  flattenEvolutionChain,
  formatAbility,
  formatBaseExperience,
  formatHeight,
  formatStatName,
  formatWeight,
  statBarWidth,
} from '@/lib/pokemon';

import {
  bulbasaur,
  charmander,
  charmanderChain,
  eeveeChain,
  mockPokeApi,
  routes,
  speciesResponse,
  taurosChain,
} from './helpers/pokeapi';
import { createGate, createQueryWrapper, dataOf } from './helpers/query';

describe('Feature 03: Detail', () => {
  it('AC: Bulbasaur shows Grass and Poison chips, 6,9 kg, 0,7 m, abilities Overgrow and Chlorophyll', async () => {
    const paths = mockPokeApi(routes({ '/pokemon/1': bulbasaur }));
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => usePokemon(1), { wrapper });
    const pokemon = await dataOf(result);

    expect(paths).toEqual(['/pokemon/1']);
    expect(pokemon.types.map(({ type }) => capitalize(type.name))).toEqual(['Grass', 'Poison']);
    expect(formatWeight(pokemon.weight)).toBe('6,9 kg');
    expect(formatHeight(pokemon.height)).toBe('0,7 m');
    expect(pokemon.abilities.map(({ ability }) => formatAbility(ability.name))).toEqual([
      'Overgrow',
      'Chlorophyll',
    ]);
  });

  it('Constraint: Base experience as `64 XP`, a dash for forms without a value; abilities with a dash in the name', () => {
    expect(formatBaseExperience(64)).toBe('64 XP');
    expect(formatBaseExperience(null)).toBe('–');
    expect(formatAbility('solar-power')).toBe('Solar Power');
  });

  it('AC: Stats show six bars. Charmander HP = 39', async () => {
    mockPokeApi(routes({ '/pokemon/4': charmander }));
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => usePokemon(4), { wrapper });
    const { stats } = await dataOf(result);

    expect(stats.map(({ stat }) => formatStatName(stat.name))).toEqual([
      'HP',
      'Attack',
      'Defense',
      'Special Attack',
      'Special Defense',
      'Speed',
    ]);
    expect(stats[0].base_stat).toBe(39);
    expect(Number.parseFloat(statBarWidth(stats[0].base_stat))).toBeCloseTo(34.21, 2);
  });

  it('Constraint: Bar width = value / 114, at most full', () => {
    expect(statBarWidth(57)).toBe('50%');
    expect(statBarWidth(114)).toBe('100%');
    expect(statBarWidth(255)).toBe('100%');
  });

  it('AC: Evolution of Charmander shows Charmander → Charmeleon → Charizard (from the species to the chain)', async () => {
    const paths = mockPokeApi(
      routes({
        '/pokemon-species/4': speciesResponse(4, 'charmander', 2),
        '/evolution-chain/2': charmanderChain,
      }),
    );
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => useEvolutionStages(4), { wrapper });
    await waitFor(() => expect(result.current.stages).toBeDefined());

    expect(result.current.stages).toEqual([
      [{ id: 4, name: 'charmander' }],
      [{ id: 5, name: 'charmeleon' }],
      [{ id: 6, name: 'charizard' }],
    ]);
    expect(paths).toEqual(['/pokemon-species/4', '/evolution-chain/2']);
  });

  it('AC: Evolution of Eevee shows one dotted line, between Eevee and its eight evolutions (a line per pair of stages, so two stages)', () => {
    const stages = flattenEvolutionChain(eeveeChain.chain);

    expect(stages).toHaveLength(2);
    expect(stages[0]).toEqual([{ id: 133, name: 'eevee' }]);
    expect(stages[1].map(({ name }) => name)).toEqual([
      'vaporeon',
      'jolteon',
      'flareon',
      'espeon',
      'umbreon',
      'leafeon',
      'glaceon',
      'sylveon',
    ]);
  });

  it('AC: A Pokémon without evolutions (e.g. Tauros) shows "This Pokémon does not evolve." (fewer than two stages)', () => {
    expect(flattenEvolutionChain(taurosChain.chain)).toEqual([[{ id: 128, name: 'tauros' }]]);
  });

  it('AC: A Pokémon without evolutions (a species without a chain stops loading, with no stages)', async () => {
    const paths = mockPokeApi(
      routes({ '/pokemon-species/10001': speciesResponse(10001, 'form', null) }),
    );
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(() => useEvolutionStages(10001), { wrapper });
    await waitFor(() => expect(result.current.stages).toEqual([]));

    expect(result.current.isPending).toBe(false);
    expect(paths).toEqual(['/pokemon-species/10001']);
  });

  it('AC: Each tab has its own loading and error state; an error in Evolution does not hide About', async () => {
    const gate = createGate();
    let chainWorks = false;
    const paths = mockPokeApi(async (path) => {
      if (path === '/pokemon/4') return charmander;
      if (path === '/pokemon-species/4') return speciesResponse(4, 'charmander', 2);
      await gate.opened;
      return chainWorks ? charmanderChain : new Response(null, { status: 500 });
    });
    const { wrapper } = createQueryWrapper();

    const { result } = await renderHook(
      () => ({ about: usePokemon(4), evolution: useEvolutionStages(4) }),
      { wrapper },
    );

    // About is there while Evolution still loads.
    await waitFor(() => expect(paths).toContain('/evolution-chain/2'));
    await waitFor(() => expect(result.current.about.data).toEqual(charmander));
    expect(result.current.evolution.isPending).toBe(true);

    // Evolution fails, About keeps its data.
    gate.open();
    await waitFor(() => expect(result.current.evolution.isPending).toBe(false));
    expect(result.current.evolution.stages).toBeUndefined();
    expect(result.current.about.data).toEqual(charmander);

    // Try again repeats the request that failed, not the species that was already there.
    chainWorks = true;
    await act(async () => {
      await result.current.evolution.refetch();
    });

    await waitFor(() => expect(result.current.evolution.stages).toHaveLength(3));
    expect(paths.filter((path) => path === '/pokemon-species/4')).toHaveLength(1);
  });
});
