/**
 * Pure helpers for Pokémon ids, names and artwork. No React, no network.
 */

const ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/**
 * The numeric id at the end of a PokeAPI resource URL.
 * `https://pokeapi.co/api/v2/pokemon/25/` → 25. Works for pokemon, species and evolution-chain URLs.
 * Returns NaN when the URL does not end in a number.
 */
export function idFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : NaN;
}

/** What a card needs from one entry of the list endpoint. */
export type PokemonListItem = {
  id: number;
  name: string;
};

/** `{ name: 'pikachu', url: '…/pokemon/25/' }` → `{ id: 25, name: 'pikachu' }`. */
export function toListItem({ name, url }: { name: string; url: string }): PokemonListItem {
  return { id: idFromUrl(url), name };
}

/**
 * The Pokémon whose name contains the text (any case) or whose number equals it (`4`, `004`).
 * Empty text finds nothing. The result keeps the order of `items`.
 */
export function filterPokemon(items: PokemonListItem[], text: string): PokemonListItem[] {
  const query = text.trim().toLowerCase();
  if (query === '') return [];

  const number = /^\d+$/.test(query) ? Number(query) : null;
  return items.filter((item) => item.name.includes(query) || item.id === number);
}

/** One link of an evolution chain, as far as flattening needs it. */
export type EvolutionLink = {
  species: { name: string; url: string };
  evolves_to: EvolutionLink[];
};

/**
 * A chain as a list of stages: Charmander, Charmeleon and Charizard are three stages, Eevee's eight
 * evolutions share the second. Per stage, because a straight list would say Vaporeon becomes Jolteon.
 */
export function flattenEvolutionChain(root: EvolutionLink): PokemonListItem[][] {
  const stages: PokemonListItem[][] = [];
  let links = [root];
  while (links.length > 0) {
    stages.push(links.map((link) => toListItem(link.species)));
    links = links.flatMap((link) => link.evolves_to);
  }
  return stages;
}

/** Official artwork for a Pokémon id. The list endpoint has no images, so we build the URL. */
export function artworkUrl(id: number): string {
  return `${ARTWORK_BASE}/${id}.png`;
}

/** Pokédex number with at least three digits: 1 → "001", 25 → "025", 1025 → "1025". */
export function formatNumber(id: number): string {
  return String(id).padStart(3, '0');
}

/** First letter upper case: "bulbasaur" → "Bulbasaur". The rest is left as the API gives it. */
export function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** One decimal with a comma. Not `toLocaleString`, so the phone's language does not change it. */
function formatDecimal(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

/** The API gives hectograms: 69 → "6,9 kg". */
export function formatWeight(hectograms: number): string {
  return `${formatDecimal(hectograms / 10)} kg`;
}

/** The API gives decimetres: 7 → "0,7 m". */
export function formatHeight(decimetres: number): string {
  return `${formatDecimal(decimetres / 10)} m`;
}

/** 64 → "64 XP". Some special forms have no value in the API: then a dash. */
export function formatBaseExperience(experience: number | null): string {
  return experience === null ? '–' : `${experience} XP`;
}

/** "overgrow" → "Overgrow", "solar-power" → "Solar Power". */
export function formatAbility(name: string): string {
  return name.split('-').map(capitalize).join(' ');
}

/** "hp" → "HP", "special-attack" → "Special Attack". */
export function formatStatName(name: string): string {
  return name === 'hp' ? 'HP' : formatAbility(name);
}

/** The highest base stat in the API: a bar with this value is full. */
const MAX_BASE_STAT = 255;

/** Width of a stat bar as a percentage of its track: 51 → "20%". */
export function statBarWidth(baseStat: number): `${number}%` {
  return `${(baseStat / MAX_BASE_STAT) * 100}%`;
}
