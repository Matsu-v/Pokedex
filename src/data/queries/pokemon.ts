/**
 * TanStack Query hooks for PokeAPI. Screens use these, never the fetch functions directly.
 */

import { type InfiniteData, skipToken, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getEvolutionChain,
  getPokemon,
  getPokemonList,
  getPokemonSpecies,
  type PokemonListResponse,
} from '@/data/pokeapi';
import { toListItem } from '@/lib/pokemon';

const PAGE_SIZE = 20;
// PokeAPI has no search endpoint; this limit returns the whole list (~1350) in one request.
const ALL_POKEMON_LIMIT = 100000;

export const pokemonKeys = {
  list: ['pokemon', 'list'] as const,
  allNames: ['pokemon', 'all-names'] as const,
  detail: (id: number | string) => ['pokemon', 'detail', id] as const,
  species: (id: number) => ['pokemon', 'species', id] as const,
  evolutionChain: (id: number) => ['pokemon', 'evolution-chain', id] as const,
};

function flattenPages(data: InfiniteData<PokemonListResponse>) {
  return data.pages.flatMap((page) => page.results.map(toListItem));
}

/** The Pokémon list as one flat array, 20 at a time. Call `fetchNextPage` to load more. */
export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: pokemonKeys.list,
    queryFn: ({ pageParam }) => getPokemonList(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastOffset) =>
      lastPage.next ? lastOffset + PAGE_SIZE : undefined,
    select: flattenPages,
  });
}

function selectListItems(data: PokemonListResponse) {
  return data.results.map(toListItem);
}

/**
 * Every Pokémon at once, for Search. Fetched once per app session: `staleTime` alone is not enough,
 * because the cache would still be dropped 5 minutes after leaving the screen.
 */
export function useAllPokemonNames() {
  return useQuery({
    queryKey: pokemonKeys.allNames,
    queryFn: () => getPokemonList(0, ALL_POKEMON_LIMIT),
    select: selectListItems,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function usePokemon(id: number | string) {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => getPokemon(id),
  });
}

export function usePokemonSpecies(id: number) {
  return useQuery({
    queryKey: pokemonKeys.species(id),
    queryFn: () => getPokemonSpecies(id),
  });
}

/**
 * Pass the chain id from the species (`idFromUrl(species.evolution_chain.url)`); waits while undefined.
 * `refetch` only works once there is an id: while it waits there is nothing to run.
 */
export function useEvolutionChain(chainId: number | undefined) {
  return useQuery({
    queryKey: pokemonKeys.evolutionChain(chainId ?? 0),
    queryFn: chainId === undefined ? skipToken : () => getEvolutionChain(chainId),
  });
}
