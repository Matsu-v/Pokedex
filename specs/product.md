# Pokédex

A Pokédex for Pokémon fans: browse every Pokémon, look one up, and keep your favourites on your phone.

Route: **Pokédex** (starter route of the final assignment). Design: the course Figma file
[Pokemon Code Challenge](https://www.figma.com/design/dsgGXcu5WELIvRW90m5308/Pokemon-Code-Challenge?node-id=0-1) (working copy for the Figma MCP: fileKey `yM5t2yGQQ279kiKIwfYyTH`, see `AGENTS.md`),
followed strictly.

> The fixed spec list for this route (appendix A) is published on day 4. When it is out, every
> feature spec below is checked against it and adjusted. Until then these specs follow the Figma design.

## Core action

Look up a Pokémon and see everything about it.

## Features

One spec file per feature in `specs/features/`.

1. [Browse](./features/01-browse.md): scroll through all Pokémon in a two-column grid that keeps loading as you scroll.
2. [Search](./features/02-search.md): find a Pokémon by name or number while typing.
3. [Detail](./features/03-detail.md): see one Pokémon with its types, artwork, and the tabs About, Stats and Evolution.
4. [Favorites](./features/04-favorites.md): mark a Pokémon with the heart and find it back in the Favorites tab, also after a restart.
5. [Options and share](./features/05-options-share.md): open the ⋮ menu on a card to open, favourite or share a Pokémon.
6. [Compare](./features/06-compare.md): put two Pokémon side by side and see who wins per stat. This is the feature we design ourselves.

## Screens

From the Figma file: Splash · Home (All Pokémon) · Search · Detail (About / Stats / Evolution) ·
Detail scrolled (collapsed header) · Favorites · Options sheet. Plus our own: Compare.

Tab bar: **Pokémons** and **Favorites**.

## Data

- **API**: [PokeAPI](https://pokeapi.co/docs/v2), no key. Endpoints: `/pokemon?limit&offset` (list),
  `/pokemon/{id|name}` (detail, stats, types), `/pokemon-species/{id}` (evolution chain link),
  `/evolution-chain/{id}`. Artwork: `sprites.other['official-artwork'].front_default`.
- **Fetching**: TanStack Query. Every query has a loading and an error state on screen.
- **Stored on the phone**: favourites in SQLite (`expo-sqlite`): Pokémon id, name and the date
  added. They survive a restart, and the Favorites tab works offline for the list itself.

## Native feature

- **Share** (React Native `Share`), in the options sheet and on the detail screen.
- **Haptics** (`expo-haptics`), a light tap when you toggle a favourite.

## Technical core checklist

- [ ] Runs in Expo Go via QR code
- [ ] Live data from PokeAPI with TanStack Query
- [ ] At least 2 screens with Expo Router
- [ ] Favourites in SQLite, surviving a restart
- [ ] Loading and error state for every load
- [ ] At least 1 native feature (Share, haptics)
- [ ] `npx tsc --noEmit` and `npx expo lint` without errors
- [ ] Logical structure: UI, data and logic are not mixed (see `AGENTS.md`)

## Bonus we aim for

Pixel-perfect design · infinite scroll · three Reanimated animations · dark mode · clean TypeScript.
