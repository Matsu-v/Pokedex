# Feature 03: Detail

## Goal

The user sees everything about one Pokémon, as on the **Detail** and **Detail – scroll** screens in Figma.

## Constraints

- Route `src/app/pokemon/[id].tsx`. Data from `/pokemon/{id}`; Evolution also from
  `/pokemon-species/{id}` → `evolution_chain.url` → `/evolution-chain/{id}`.
- Header: back arrow, heart (feature 04), name, number (`001`), type chips with a coloured dot
  (colour per type from the theme), large artwork on a light background.
- Three tabs under the artwork: **About**, **Stats**, **Evolution**. Tabs are local state, not routes.
- About: Name, ID, Base (base experience, `64 XP`), Weight (`6,9 kg`, the API gives hectograms),
  Height (`0,7 m`, the API gives decimetres), Types, Abilities.
- Stats: HP, Attack, Defense, Special Attack, Special Defense, Speed, each with its value and a
  bar. Bar width = value / 255.
- Evolution: the chain in order, each with artwork, number and name; tapping one opens it.
- Scrolling collapses the header into a small bar with the name (Detail – scroll).
- Unit conversions and chain flattening are pure functions in `src/lib/`.

## Acceptance criteria

- [ ] Bulbasaur shows Grass and Poison chips, 6,9 kg, 0,7 m, abilities Overgrow and Chlorophyll.
- [ ] Stats show six bars. Charmander HP = 39.
- [ ] Evolution of Charmander shows Charmander → Charmeleon → Charizard; tapping Charizard opens it.
- [ ] A Pokémon without evolutions (e.g. Tauros) shows "This Pokémon does not evolve."
- [ ] Each tab has its own loading and error state; an error in Evolution does not hide About.
- [ ] The back arrow returns to where the user came from.

## Out of scope

Moves, locations, cries, shiny sprites, forms.
