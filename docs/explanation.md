# Explanation - Pokédex

**Route:** Pokédex. **Tools:** Claude Code.

## 1. Your technical choices

**Stored in SQLite: the favourites.** The table is in `src/data/db.ts:19` and all SQL is in
`src/data/favorites-repository.ts`. The alternative was AsyncStorage with one JSON list. I chose SQLite
because the primary key (`src/data/db.ts:20`) rules out duplicates, and `ORDER BY added_at DESC`
(`src/data/favorites-repository.ts:35`) gives newest first without sorting in code. The name is stored as well
(`src/data/db.ts:21`), so the Favorites list shows without network. API responses are not stored: TanStack
Query caches those. The choice itself did not change. What did change is how a tap saves: since issue #41
(commit `007d4de`) the heart changes at once and goes back if the write fails
(`src/data/queries/favorites.ts:72`).

**Native feature: haptics.** A light tap when you toggle the heart on Detail
(`src/components/detail-top-bar.tsx:83`). The alternative was Share. I chose haptics because the tap confirms
the one action that saves something, it needs no permission and it works in Expo Go. This did change: my first
`product.md` had both Share and haptics (commit `55a0d7a`). When appendix A came out, the options sheet with
Share turned out not to be required, so I made it optional (commit `b89247f`) and did not build it. Haptics is
now the only native feature.

## 2. Pick one feature and explain how it works, from API call to screen.

**Browse, the list on Home.**

*API call.* `getPokemonList` (`src/data/pokeapi.ts:89`) asks PokeAPI for `/pokemon?limit=20&offset=...`. That
file is the only place that talks to the API.

*Cache.* `usePokemonList` (`src/data/queries/pokemon.ts:34`) wraps this in TanStack's `useInfiniteQuery`.
`getNextPageParam` (`src/data/queries/pokemon.ts:39`) adds 20 to the offset for as long as the API gives a `next`
link. `select` turns the pages into one flat array, and `toListItem` (`src/lib/pokemon.ts:24`) takes the id from
each URL. The pages stay in TanStack's cache and count as fresh for 5 minutes (`src/data/query-client.ts:8`).
Nothing from the list goes into SQLite.

*Screen.* `src/app/(tabs)/index.tsx` calls the hook and gives the array to `PokemonGrid`
(`src/components/pokemon-grid.tsx`), a `FlatList` with two columns of `PokemonCard`
(`src/components/pokemon-card.tsx`). The list endpoint has no images, so a card builds its image URL from the id
(`src/lib/pokemon.ts:74`). When you scroll near the end, `onEndReached` calls `loadMore`
(`src/app/(tabs)/index.tsx:23`), which fetches the next page.

*Loading and error.* The states are in `src/components/query-state.tsx`. The first load shows `LoadingState`. If
it fails, `ErrorState` shows **Try again**, which calls `refetch`. While a next page loads, `LoadMoreFooter` shows
a spinner below the list, and **Try again** if that page fails. `data` is checked first
(`src/app/(tabs)/index.tsx:32`), so a failed next page does not take away the list that is already there.

## 3. Name a suggestion from the agent that you rejected or changed.

The length of the stat bars on Detail. In its plan on issue #7 the agent recommended value / 255, the highest stat
in the API, and it was built that way. I then told it to follow Figma pixel perfect. It reported the bars as the
one deliberate difference from Figma merged so far, about half as long as in the design, and it advised to keep
them: no formula matches Figma exactly, and with a lower scale the bars say less.

I went against that advice and took the other option from its plan, value / 114 (`src/lib/pokemon.ts:126`), because
that is the closest a formula gets to Figma: 3 px per point on the track of 342 px. For Charmander, Special Attack
and Special Defense now match Figma exactly. The
downside, which I accepted, is that everything from 114 up is a full bar, so on Detail the number next to the bar
tells strong Pokémon apart. Compare has its own scale for that reason, value / 255 (`src/lib/compare.ts:68`).

See commit `2315d40` and [PR #33](https://github.com/Matsu-v/Pokedex/pull/33), which has the numbers per stat.
