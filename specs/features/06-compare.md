# Feature 06: Compare

## Goal

The user picks two Pokémon and sees them side by side, with per stat who is stronger. This is the
feature of the Pokédex route that we design ourselves; there is no Figma screen for it.

## Constraints

- Entry point: a **Compare** button on the Detail screen. It opens Compare with the current
  Pokémon on the left and an empty slot on the right.
- The empty slot opens a picker that reuses Search (feature 02).
- Route `src/app/compare.tsx` with params `a` and `b` (ids), so a comparison can be reopened.
- Layout follows the design language of Detail: two artworks with name and type chips on top, then
  the six stats as rows with both values and two bars growing outward from the middle.
- The higher value per row is bold and in the colour of that Pokémon's first type. Equal = both normal.
- Below the stats: the total of all six, and a one-line verdict, e.g. "Charizard wins 4 of 6 stats".
- The comparison logic is a pure function in `src/lib/`.
- A **Swap** button swaps left and right.

## Acceptance criteria

- [ ] From Charmander's Detail, Compare → pick Squirtle shows both with six stat rows.
- [ ] Per row the higher value is highlighted; the verdict counts wins correctly.
- [ ] Swap flips both sides and the verdict follows.
- [ ] Each side has its own loading and error state.
- [ ] Comparing a Pokémon with itself shows all stats equal and "It's a tie".

## Out of scope

Comparing more than two. Type effectiveness or battle simulation.
