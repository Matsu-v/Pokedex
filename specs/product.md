# Pokédex

A Pokédex for Pokémon fans: browse every Pokémon, look one up, and keep your favourites on your phone.

Route: **Pokédex** of the final assignment; the required features are in appendix A of the course's
`exam/README.md`. Design: the course Figma file
[Pokemon Code Challenge](https://www.figma.com/design/dsgGXcu5WELIvRW90m5308/Pokemon-Code-Challenge?node-id=0-1)
(working copy for the Figma MCP: fileKey `yM5t2yGQQ279kiKIwfYyTH`, see `AGENTS.md`), followed closely.

## Core action

Look up a Pokémon and see everything about it.

## Features

One spec file per feature in `specs/features/`.

1. [Browse](./features/01-browse.md): scroll through all Pokémon in a two-column grid that keeps loading as you scroll.
2. [Search](./features/02-search.md): find a Pokémon by name or number while typing.
3. [Detail](./features/03-detail.md): see one Pokémon with its types, artwork, and the tabs About, Stats and Evolution.
4. [Favorites](./features/04-favorites.md): mark a Pokémon with the heart and find it back in the Favorites tab, also after a restart.
5. [Compare](./features/06-compare.md): put two Pokémon side by side and see who wins per stat. This is the feature we design ourselves.

Not built: the [options sheet with Share](./optional/05-options-share.md) and the
[collapsing header](./optional/detail-collapsing-header.md). Both are in Figma but not in appendix A.

## Data

- **API**: [PokeAPI](https://pokeapi.co/docs/v2), no key.
- **Endpoints**: `/pokemon?limit&offset` (list and search), `/pokemon/{id|name}` (detail, stats, types),
  `/pokemon-species/{id}` (evolution chain link), `/evolution-chain/{id}`.
  Images: built from the id, a sprite on cards and the artwork on Detail and Compare, see feature 01.
- **Fetching**: TanStack Query. Every query has a loading and an error state on screen.
- **Stored on the phone**: favourites in SQLite (`expo-sqlite`): columns `id`, `name`, `added_at`.
- **Runs on**: Expo Go with SDK 58. The project moved from SDK 57 on the day of the hand-in, because
  Expo Go in the stores now only opens the latest SDK.

## Technical choices

- **Stored in SQLite**: the favourites, because that is the one thing a user creates and expects to
  keep. Alternative: AsyncStorage with one JSON list. SQLite instead, because the primary key rules out
  duplicates and `ORDER BY added_at` gives newest first without sorting in code. `name` is stored as
  well, so the Favorites list shows without network. API responses are not stored: TanStack Query
  caches those.
- **Native feature**: haptics (`expo-haptics`), a light tap when you toggle the heart on Detail.
  Alternative: Share, which belonged to the options sheet that was not built. Haptics, because the tap
  confirms the one action that saves something, needs no permission and works in Expo Go.

## Technical core

- [x] Runs in Expo Go
- [x] Live data through TanStack Query
- [x] At least 2 screens with Expo Router
- [x] Favourites in SQLite that survive a restart
- [x] Loading and error state on every load
- [x] One native feature: haptics on the heart on Detail
- [x] TypeScript and ESLint without errors
- [x] UI, data and logic in separate files (see `AGENTS.md`)

## Optional

Ticked when built, +0.5 each.

- [ ] Three different Reanimated animations, each with a purpose
- [ ] Dark mode: every screen looks right, all colours from the theme
- [x] Pagination: page by page while you scroll, not all at once
- [x] Clean TypeScript: no `any`, no `as` casts, no `@ts-ignore`
- [ ] Localization: two languages
- [ ] No warnings: no `console.log`, none in the terminal or on screen
- [ ] Offline: works in airplane mode with the last data
- [x] Tests: one per feature on the logic, `npm test` passes
- [ ] CI: lint and tsc on every push
- [ ] Accessibility: button labels, largest text size
- [x] Optimistic update

## Out of scope

Accounts, a web version, other APIs, filters, battles.
