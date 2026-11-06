# Feature 04: Favorites

Appendix A: **Favorites**, and "Favorite and unfavorite" under Detail.

## Goal

The user marks Pokémon with the heart and finds them back in the **Favorites** tab, also after
closing the app, as on the **Favorites** screen in Figma.

## Constraints

- `expo-sqlite`. Table `favorites (id INTEGER PRIMARY KEY, name TEXT NOT NULL, added_at TEXT NOT NULL)`.
  The migration runs at app start.
- All SQL lives in one repository file in `src/data/`. Screens and components never write SQL.
- Hooks (`useFavorites`, `useIsFavorite`, `useToggleFavorite`) expose the data to the UI. SQLite reads
  also go through TanStack Query, with invalidation after the last write of a series, also after a
  failure, so every screen updates.
- Heart on Detail: outline = not a favourite, filled red = favourite. Toggling gives a light haptic
  tap (`expo-haptics`). This is the app's required native feature.
- The heart is an optimistic update: it changes at the tap, before the write is done, and goes back if
  the write fails. A tap writes a target (add or remove), taken from the cache; it does not flip what
  SQLite has. Writes run one at a time, in the order of the taps. The Favorites list is not optimistic:
  Detail lies over it during the tap, and it reads SQLite again once the writes are done.
- Favorites tab: title "My favorites" as in Figma, same two-column cards as Browse, newest first.
- Figma has no empty, loading or error state here. In all three the title stays in its place, with the
  message, spinner or error centred below it.
- Tab bar as in Figma: each tab has its own active and inactive icon (filled and outline). Android
  has no pill behind the active icon and a solid Daylight bar. Labels are in Rubik, the course's font;
  Android allows one family for both states, so only iOS has Figma's bold active label.
- Colours, sizes and fonts only from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] Tapping the heart on Detail fills it and the Pokémon appears in Favorites.
- [ ] Tapping it again empties it and the Pokémon disappears from Favorites.
- [ ] After fully closing and reopening the app, the favourites are still there.
- [ ] Empty Favorites shows a short message with a hint to tap the heart.
- [ ] The Favorites list shows without network (name and number come from SQLite).
- [ ] Tapping a card in Favorites opens its Detail screen.
- [ ] The phone vibrates lightly on every toggle.
- [ ] The heart changes at once, before the write to SQLite is done.
- [ ] If the write fails, the heart goes back, and Favorites agrees with it.
- [ ] A double tap ends where the last tap points, also if the first write fails.

## Out of Scope

Sorting or grouping favourites. Sync between devices. A message when a write fails: Figma has no toast,
so the heart going back is the feedback.
