# Feature 03: Detail

Appendix A: **Detail**.

## Goal

The user sees everything about one Pokémon, as on the **Detail** screen in Figma.

## Constraints

- Route `src/app/pokemon/[id].tsx`, opened from Browse, Search, Favorites and the evolution chain.
  Data from `/pokemon/{id}`; Evolution also from `/pokemon-species/{id}` → `evolution_chain.url` →
  `/evolution-chain/{id}`.
- Header: back arrow, heart (feature 04), name, number (`001`), type chips with a coloured dot
  (colour per type from the theme), large artwork on a light background.
- Three tabs under the artwork: **About**, **Stats**, **Evolution**. Tabs are local state, not routes.
- About: Name, ID, Base (base experience, `64 XP`), Weight (`6,9 kg`, the API gives hectograms),
  Height (`0,7 m`, the API gives decimetres), Types, Abilities.
- Stats: HP, Attack, Defense, Special Attack, Special Defense, Speed, each with its value and a
  bar. Bar width = value / 255.
- Evolution: the chain in order, each with artwork, number and name; tapping one opens it.
- Unit conversions and chain flattening are pure functions in `src/lib/`.
- Colours, sizes and fonts only from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] Bulbasaur shows Grass and Poison chips, 6,9 kg, 0,7 m, abilities Overgrow and Chlorophyll.
- [ ] Stats show six bars. Charmander HP = 39.
- [ ] Evolution of Charmander shows Charmander → Charmeleon → Charizard; tapping Charizard opens it.
- [ ] A Pokémon without evolutions (e.g. Tauros) shows "This Pokémon does not evolve."
- [ ] Switching tabs is immediate: no reload of data that is already there.
- [ ] Detail opens from a card in Browse and from a card in Favorites.
- [ ] Each tab has its own loading and error state; an error in Evolution does not hide About.
- [ ] The back arrow returns to where the user came from.

## Out of Scope

Moves, locations, cries, shiny sprites, forms. The collapsing header
([optional](../optional/detail-collapsing-header.md), #9).
