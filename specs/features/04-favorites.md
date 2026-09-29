# Feature 04: Favorites

## Goal

The user marks Pokémon with the heart and finds them back in the **Favorites** tab, also after
closing the app, as on the **Favorites** screen in Figma.

## Constraints

- `expo-sqlite`. Table `favorites (id INTEGER PRIMARY KEY, name TEXT NOT NULL, added_at TEXT NOT NULL)`.
  The migration runs at app start.
- All SQL lives in one repository file in `src/data/`. Screens and components never write SQL.
- Hooks (`useFavorites`, `useIsFavorite`, `useToggleFavorite`) expose the data to the UI. SQLite reads
  also go through TanStack Query, with invalidation after every write, so every screen updates.
- Heart on Detail: outline = not a favourite, filled red = favourite. Toggling gives a light haptic
  tap (`expo-haptics`).
- Favorites tab: title "My Favorites", same two-column cards as Browse, newest first.

## Acceptance criteria

- [ ] Tapping the heart on Detail fills it and the Pokémon appears in Favorites.
- [ ] Tapping it again empties it and the Pokémon disappears from Favorites.
- [ ] After fully closing and reopening the app, the favourites are still there.
- [ ] Empty Favorites shows a short message with a hint to tap the heart.
- [ ] The Favorites list shows without network (name and number come from SQLite).
- [ ] The phone vibrates lightly on every toggle.

## Out of scope

Sorting or grouping favourites. Sync between devices.
