# Feature 06: Compare

Appendix A: **Compare (you design it)**.

## Goal

The user picks two Pokémon and sees them side by side, with per stat who is stronger. This is the
feature of the Pokédex route that we design ourselves; there is no Figma screen for it.

## Constraints

- Entry point: a **Compare** text button in the top bar of Detail, left of the heart. Figma has no
  such button; the bar has free space there, so nothing else on Detail moves. It opens Compare with
  the current Pokémon on the left and an empty slot on the right.
- The empty slot is a card with the Search icon and "Pick a Pokémon". It opens Search (feature 02) with
  the param `compareWith`; tapping a result returns to the waiting Compare, so back from there goes to
  Detail. The same Pokémon can be picked. Without the param Search works as usual.
- Route `src/app/compare.tsx` with params `a` and `b` (ids), so a comparison can be reopened.
- Layout follows the design language of Detail at half width (columns 163 + 16 + 163): name and type
  chips, then the artwork hanging a quarter over the white part. The columns mirror each other: the
  text keeps to the outer margin, right above the values. Then the six stats as rows with both values
  and two bars growing outward from the middle.
- The higher value per row is bold with a dot in the colour of that Pokémon's first type, and the number
  stays Midnight. Equal = both normal. Not the number itself in the type colour, as this spec first said:
  on white eight first-type colours stay below 3:1 (electric 1.5, ice 1.6), and Figma only shows type
  colours as a dot.
- The bars are Detail's: purple on the grey track, 4 high. Width = value / 255, the highest base stat in
  the API, so nothing is capped and strong Pokémon stay apart. Not Detail's value / 114, where everything
  from 114 up is a full bar. The same value has the same length in every comparison.
- Below the stats: the total of all six (same row, no bar), and a one-line verdict, e.g.
  "Charizard wins 4 of 6 stats". The verdict counts stats won, not the total: equal wins is "It's a tie",
  also when the totals differ.
- The comparison logic is a pure function in `src/lib/`.
- A **Swap** text button in the top bar swaps left and right, and is disabled while the slot is empty.
- Colours, sizes and fonts only from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] From Charmander's Detail, Compare → pick Squirtle shows both with six stat rows.
- [ ] Per row the higher value is highlighted; the verdict counts wins correctly.
- [ ] Swap flips both sides and the verdict follows.
- [ ] Each side has its own loading and error state.
- [ ] Comparing a Pokémon with itself shows all stats equal and "It's a tie".
- [ ] Charmander vs Squirtle wins 3 each with totals of 309 and 314, and shows "It's a tie".

## Out of Scope

Comparing more than two. Type effectiveness or battle simulation. Changing a Pokémon that has been
picked: back to Detail and Compare again.
