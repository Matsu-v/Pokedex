# Optional: collapsing header on Detail

Not in appendix A, so not part of the required app. Issue #9. When it is built, move this into
`specs/features/03-detail.md`.

## Goal

Scrolling the Detail screen collapses the header into a small bar with the name, as on the
**Detail – scroll** screen in Figma.

## Constraints

- Built with Reanimated. Counts as one of the three animations for the bonus.
- Colours, sizes and fonts only from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] The header shrinks smoothly while scrolling and grows back when scrolling up.
- [ ] The name stays visible in the small bar.
- [ ] The back arrow and the heart keep working in both states.

## Out of Scope

Other screens.
