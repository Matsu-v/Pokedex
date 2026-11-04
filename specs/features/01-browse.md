# Feature 01: Browse

Appendix A: **List**.

## Goal

The user scrolls through all ~1300 Pokémon in the order of their number, as on the **Home** screen
in Figma, and taps one to open it.

## Constraints

- Data from `GET /pokemon?limit=20&offset=n` via TanStack Query (`useInfiniteQuery`). The list
  endpoint has no artwork: build the image URL from the id
  (`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`)
  and take the id from the `url` field. No extra request per card.
- `FlatList` with `numColumns={2}`. Loads the next page at `onEndReached`.
- Card as in Figma: number badge (`001`, three digits, purple), artwork, name. The ⋮ button belongs
  to the optional options sheet ([spec](../optional/05-options-share.md), #13). If that is not built
  by the hand-in, the ⋮ is hidden: no button without an action.
- Title "All Pokémon", search bar on top that opens the Search screen (feature 02).
- Colours, sizes and fonts only from `src/constants/theme.ts`. Fonts are loaded with Expo Font.

## Acceptance Criteria

- [ ] The first 20 Pokémon show with name, number and artwork, starting at Bulbasaur 001.
- [ ] Scrolling to the end loads the next 20, with a small spinner at the bottom while loading.
- [ ] It keeps loading until the end of the list, and scrolling stays smooth.
- [ ] First load shows a loading state. No network shows an error state with a **Try again** button that refetches.
- [ ] Tapping a card opens the Detail screen of that Pokémon (`/pokemon/[id]`).
- [ ] Names start with a capital letter ("Bulbasaur", not "bulbasaur").
- [ ] Tab bar has two tabs: **Pokémons** (this screen) and **Favorites**.

## Out of Scope

Filters by type or generation. Sorting. Pull to refresh.
