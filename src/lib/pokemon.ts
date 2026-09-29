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
