/**
 * The outside world of the API tests: `fetch` is replaced, so `src/data/pokeapi.ts` and the hooks run
 * for real and the tests never use the network. The Pokémon below were read from the live API.
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * `answer` gets the path of each request and returns the JSON body. Throwing is "no network", returning
 * a `Response` is an answer with that status. Returns the paths of all requests, in order.
 */
export function mockPokeApi(answer: (path: string) => unknown): string[] {
  const paths: string[] = [];

  jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const path = String(input).replace(BASE_URL, '');
    paths.push(path);
    const body = await answer(path);
    return body instanceof Response ? body : new Response(JSON.stringify(body));
  });

  return paths;
}

/** An answer per path. Any other request fails the test. */
export function routes(table: Record<string, unknown>) {
  return (path: string) => {
    if (!(path in table)) throw new Error(`Unexpected request: ${path}`);
    return table[path];
  };
}

export function noNetwork(): never {
  throw new TypeError('Network request failed');
}

/** A body for `/pokemon?limit=…&offset=…`. */
export function listResponse(results: { id: number; name: string }[], next: string | null = null) {
  return {
    count: results.length,
    next,
    previous: null,
    results: results.map(({ id, name }) => ({ name, url: `${BASE_URL}/pokemon/${id}/` })),
  };
}

/** A body for `/pokemon-species/{id}`. */
export function speciesResponse(id: number, name: string, chainId: number | null) {
  return {
    id,
    name,
    evolution_chain: chainId === null ? null : { url: `${BASE_URL}/evolution-chain/${chainId}/` },
  };
}

const STAT_NAMES = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

function pokemon(fixture: {
  id: number;
  name: string;
  weight: number;
  height: number;
  baseExperience: number;
  types: string[];
  abilities: string[];
  stats: number[];
}) {
  return {
    id: fixture.id,
    name: fixture.name,
    weight: fixture.weight,
    height: fixture.height,
    base_experience: fixture.baseExperience,
    types: fixture.types.map((name, index) => ({ slot: index + 1, type: { name, url: '' } })),
    abilities: fixture.abilities.map((name, index) => ({
      ability: { name, url: '' },
      is_hidden: false,
      slot: index + 1,
    })),
    stats: fixture.stats.map((base_stat, index) => ({
      base_stat,
      effort: 0,
      stat: { name: STAT_NAMES[index], url: '' },
    })),
    species: { name: fixture.name, url: '' },
    sprites: { front_default: null },
  };
}

export const bulbasaur = pokemon({
  id: 1,
  name: 'bulbasaur',
  weight: 69,
  height: 7,
  baseExperience: 64,
  types: ['grass', 'poison'],
  abilities: ['overgrow', 'chlorophyll'],
  stats: [45, 49, 49, 65, 65, 45],
});

export const charmander = pokemon({
  id: 4,
  name: 'charmander',
  weight: 85,
  height: 6,
  baseExperience: 62,
  types: ['fire'],
  abilities: ['blaze', 'solar-power'],
  stats: [39, 52, 43, 60, 50, 65],
});

export const squirtle = pokemon({
  id: 7,
  name: 'squirtle',
  weight: 90,
  height: 5,
  baseExperience: 63,
  types: ['water'],
  abilities: ['torrent', 'rain-dish'],
  stats: [44, 48, 65, 50, 64, 43],
});

export const pikachu = pokemon({
  id: 25,
  name: 'pikachu',
  weight: 60,
  height: 4,
  baseExperience: 112,
  types: ['electric'],
  abilities: ['static', 'lightning-rod'],
  stats: [35, 55, 40, 50, 50, 90],
});

type ChainLinkBody = {
  is_baby: boolean;
  species: { name: string; url: string };
  evolves_to: ChainLinkBody[];
};

function link(name: string, id: number, ...evolvesTo: ChainLinkBody[]): ChainLinkBody {
  return {
    is_baby: false,
    species: { name, url: `${BASE_URL}/pokemon-species/${id}/` },
    evolves_to: evolvesTo,
  };
}

/** `/evolution-chain/2`. */
export const charmanderChain = {
  id: 2,
  chain: link('charmander', 4, link('charmeleon', 5, link('charizard', 6))),
};

/** `/evolution-chain/67`. */
export const eeveeChain = {
  id: 67,
  chain: link(
    'eevee',
    133,
    link('vaporeon', 134),
    link('jolteon', 135),
    link('flareon', 136),
    link('espeon', 196),
    link('umbreon', 197),
    link('leafeon', 470),
    link('glaceon', 471),
    link('sylveon', 700),
  ),
};

/** `/evolution-chain/63`. */
export const taurosChain = { id: 63, chain: link('tauros', 128) };
