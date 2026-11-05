/**
 * Pure comparison of two Pokémon for the Compare screen. No React, no network.
 */

import { capitalize } from '@/lib/pokemon';

export type Side = 'left' | 'right';

/** What comparing needs from a Pokémon. */
export type ComparedPokemon = {
  name: string;
  stats: { base_stat: number; stat: { name: string } }[];
};

export type ComparedValue = {
  left: number;
  right: number;
  /** The side with the higher value; null when they are equal. */
  winner: Side | null;
};

export type StatRow = ComparedValue & { name: string };

export type Comparison = {
  rows: StatRow[];
  total: ComparedValue;
  /** Counts the stats won, not the total: 3 wins each is a tie, also with different totals. */
  verdict: string;
};

function compareValues(left: number, right: number): ComparedValue {
  const winner = left === right ? null : left > right ? 'left' : 'right';
  return { left, right, winner };
}

function sumStats(pokemon: ComparedPokemon): number {
  return pokemon.stats.reduce((sum, { base_stat }) => sum + base_stat, 0);
}

/** Who is stronger per stat. The API gives the six stats in the same order for every Pokémon. */
export function compareStats(left: ComparedPokemon, right: ComparedPokemon): Comparison {
  const rows = left.stats.map(({ stat, base_stat }, index) => ({
    name: stat.name,
    ...compareValues(base_stat, right.stats[index].base_stat),
  }));
  const leftWins = rows.filter((row) => row.winner === 'left').length;
  const rightWins = rows.filter((row) => row.winner === 'right').length;

  return {
    rows,
    total: compareValues(sumStats(left), sumStats(right)),
    verdict:
      leftWins === rightWins
        ? "It's a tie"
        : leftWins > rightWins
          ? `${capitalize(left.name)} wins ${leftWins} of ${rows.length} stats`
          : `${capitalize(right.name)} wins ${rightWins} of ${rows.length} stats`,
  };
}

/** The highest base stat in the API (Blissey's HP): nothing is capped, so strong Pokémon stay apart. */
const HIGHEST_BASE_STAT = 255;

/**
 * Width of a stat bar on Compare as a percentage of its half of the row: 51 → "20%", 255 → "100%".
 * Not `statBarWidth`: that is Detail's scale, where everything from 114 up is a full bar.
 */
export function compareBarWidth(baseStat: number): `${number}%` {
  return `${(baseStat / HIGHEST_BASE_STAT) * 100}%`;
}
