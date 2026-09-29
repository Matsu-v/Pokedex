/**
 * The only place that talks to PokeAPI (https://pokeapi.co/docs/v2). Response types hold only the
 * fields the app uses.
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

/** A `{ name, url }` pair, the way PokeAPI links to other resources. */
export type NamedResource = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedResource[];
};

export type PokemonType = {
  slot: number;
  type: NamedResource;
};

export type PokemonAbility = {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: NamedResource;
};

export type Pokemon = {
  id: number;
  name: string;
  /** Can be null for some special forms. */
  base_experience: number | null;
  /** Decimetres. */
  height: number;
  /** Hectograms. */
  weight: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  species: NamedResource;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
};

export type PokemonSpecies = {
  id: number;
  name: string;
  /** Null for a few species that are not part of any chain. */
  evolution_chain: { url: string } | null;
};

export type ChainLink = {
  is_baby: boolean;
  species: NamedResource;
  evolves_to: ChainLink[];
};

export type EvolutionChain = {
  id: number;
  chain: ChainLink;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`PokeAPI ${path} failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

/** One page of the Pokémon list, in number order. */
export function getPokemonList(offset: number, limit = 20): Promise<PokemonListResponse> {
  return request(`/pokemon?limit=${limit}&offset=${offset}`);
}

/** Details, types and stats of one Pokémon. */
export function getPokemon(idOrName: number | string): Promise<Pokemon> {
  return request(`/pokemon/${idOrName}`);
}

/** Species of a Pokémon; holds the link to its evolution chain. */
export function getPokemonSpecies(id: number): Promise<PokemonSpecies> {
  return request(`/pokemon-species/${id}`);
}

/** The evolution chain with the given id (take it from `species.evolution_chain.url`). */
export function getEvolutionChain(id: number): Promise<EvolutionChain> {
  return request(`/evolution-chain/${id}`);
}
