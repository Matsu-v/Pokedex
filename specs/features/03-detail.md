# Feature 03: Detail

Appendix A: **Detail**.

## Goal

The user sees everything about one Pokémon, as on the **Detail** screen in Figma.

## Constraints

- Route `src/app/pokemon/[id].tsx`, opened from Browse, Search, Favorites and the evolution chain.
  Data from `/pokemon/{id}`; Evolution also from `/pokemon-species/{id}` → `evolution_chain.url` →
  `/evolution-chain/{id}`.
- Header: back arrow with the label "Vorige" as in Figma, heart (feature 04), name, number (`#001`),
  type chips with a coloured dot (colour per type from the theme), large artwork on a light background.
- Three tabs under the artwork: **About**, **Stats**, **Evolution**. Tabs are local state, not routes.
- About: Name, ID, Base (base experience, `64 XP`), Weight (`6,9 kg`, the API gives hectograms),
  Height (`0,7 m`, the API gives decimetres), Types, Abilities.
- Stats: HP, Attack, Defense, Special Attack, Special Defense, Speed, each with its value and a
  bar. Bar width = value / 255. Figma's bars are longer, but they are sample data and follow no rule.
- Evolution: the chain in order, each with artwork, number and name; tapping one opens it, on About.
  Figma only shows a straight chain. A branching chain goes per stage: a dotted line between the
  stages, the cards of one stage below each other (Eevee, then its eight evolutions). A line between
  all cards would say Vaporeon becomes Jolteon. The price: Wurmple does not show that Silcoon becomes
  Beautifly and Cascoon becomes Dustox.
- The card of the Pokémon on screen looks like the others, but is not a button: it is already open.
- The chain loads when the Evolution tab opens, not with the rest of Detail.
- Below the last card: 26 px from the edge of the screen, as in Figma, so a chain of three does not
  scroll on 844. Above a row of Android buttons it stays clear of them; About and Stats keep their own gap.
- Unit conversions and chain flattening are pure functions in `src/lib/`.
- Colours, sizes and fonts only from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] Bulbasaur shows Grass and Poison chips, 6,9 kg, 0,7 m, abilities Overgrow and Chlorophyll.
- [ ] Stats show six bars. Charmander HP = 39.
- [ ] Evolution of Charmander shows Charmander → Charmeleon → Charizard; tapping Charizard opens it.
- [ ] Evolution of Eevee shows one dotted line, between Eevee and its eight evolutions.
- [ ] On the Evolution tab of Charmander, the Charmander card does nothing and is not announced as a button.
- [ ] A Pokémon without evolutions (e.g. Tauros) shows "This Pokémon does not evolve."
- [ ] Switching tabs is immediate: no reload of data that is already there.
- [ ] Detail opens from a card in Browse and from a card in Favorites.
- [ ] Each tab has its own loading and error state; an error in Evolution does not hide About.
- [ ] The back arrow returns to where the user came from.

## Out of Scope

Moves, locations, cries, shiny sprites, forms. The collapsing header
([optional](../optional/detail-collapsing-header.md), #9).
