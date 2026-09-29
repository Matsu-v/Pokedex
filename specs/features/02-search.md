# Feature 02: Search

## Goal

The user finds a Pokémon by typing (part of) its name or its number, as on the **Search** screen in Figma.

## Constraints

- PokeAPI has no search endpoint. Fetch the full name list once
  (`/pokemon?limit=100000&offset=0`, ~1300 entries, cached by TanStack Query with a long
  `staleTime`) and filter it on the phone.
- The filter is a pure function in `src/lib/`, so it can be checked without UI.
- Matches on: name contains the text (case-insensitive), or the number equals the text (`4`, `004`).
- Results use the same card as Browse. Keyboard opens automatically, back arrow returns to Home.
- Debounce the input by ~250 ms.

## Acceptance criteria

- [ ] "Ch" shows Charmander, Charmeleon, Charizard, Chikorita … in number order.
- [ ] "25" shows Pikachu.
- [ ] Empty field shows no results and no error.
- [ ] No match shows "No Pokémon found for “xyz”".
- [ ] While the name list loads: loading state. When it fails: error state with **Try again**.
- [ ] Tapping a result opens its Detail screen.

## Out of scope

Search on type, ability or move. Search history.
