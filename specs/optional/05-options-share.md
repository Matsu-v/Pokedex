# Optional: options sheet and share

Not in appendix A, so not part of the required app. Issue #13. When it is built, move this file back
to `specs/features/` and add it to `specs/product.md`. If it is not built, the ⋮ on the card is hidden.

## Goal

From any card, the user opens a menu to act on a Pokémon without opening it first, as on the
**Options** screen in Figma.

## Constraints

- The ⋮ button on a card opens a bottom sheet with a dimmed backdrop and three rows:
  **Open Pokémon**, **Add to favorites** (or **Remove from favorites**), **Share**.
- Built with React Native `Modal`. No extra sheet library unless the plan argues for one.
- Share uses React Native `Share.share` with the text
  `Check out {Name} (#{number}) in my Pokédex! https://pokeapi.co/api/v2/pokemon/{id}`.
- The same Share action is also on the Detail screen.
- Tapping the backdrop closes the sheet.

## Acceptance Criteria

- [ ] ⋮ on a card in Browse, Search and Favorites opens the sheet for that Pokémon.
- [ ] Open Pokémon opens its Detail screen and closes the sheet.
- [ ] The favourite row shows the right label and toggles the favourite (same effect as the heart).
- [ ] Share opens the native share sheet with the text above.
- [ ] Tapping the backdrop closes the sheet without an action.

## Out of Scope

Custom share images. Sharing to a specific app.
