# Where the app differs from Figma

Status: 6 November 2026, up to and including the upgrade to SDK 58 ([PR #46](https://github.com/Matsu-v/Pokedex/pull/46)). Mats went through the phone test on Android without remarks. iOS has not been run.

When things conflict, the order is: course rule (appendix A of `exam/README.md`), then Figma pixel perfect, then our own specs.

"Figma" means the iOS row of page *Mobile*, 390x844. Measurements come from web exports at that size, with Figma's 44 px status bar subtracted. See section 7 for what has not been seen on a phone.

## 1. Could be matched, but chosen not to

**Sharpness of the sprites on the cards.** Since [PR #39](https://github.com/Matsu-v/Pokedex/pull/39), cards on Browse, Search, Favorites and Evolution show the same 96x96 sprites as Figma, in the same box. Figma scales them up pixel-sharp, from 96 to 163 pt on the Row card and to 80 pt on the List card.

- The app will be softer. `expo-image` has no option to scale without smoothing: iOS sets `.trilinear` in `ImageView.swift`, and Android draws with the default bitmap filter.
- Skia can do it in Expo Go with `FilterMode.Nearest`. The price is one new package and a canvas per card. Smooth scrolling and offline images are then untested, and appendix A's smooth scrolling goes above Figma.
- Mats went through the phone test on Android without remarks, so Skia was not added. A switch would only change `CardImage` in `src/components/pokemon-card.tsx`.

## 2. Cannot be matched

| Where | Figma | App | Why |
|---|---|---|---|
| Stat bars on Detail | Hand-drawn, 2.26 to 3.00 px per point | value / 114, at most full | No formula reproduces them. Exact on 2 of Charmander's 6 rows (Special Attack 180, Special Defense 150); HP is 117 against 88, Speed 195 against 150. Everything from 114 up is a full bar. Chosen by Mats ([PR #33](https://github.com/Matsu-v/Pokedex/pull/33)) |
| Active tab label, Android | Bold, inactive label medium | Medium in both states | The Android bar takes one font family for both states ([PR #36](https://github.com/Matsu-v/Pokedex/pull/36)). iOS does get bold |
| Tab bar on Favorites, iOS | Solid `#EDF6FF` | 50% with blur, as on Home | The docs offer no background per tab (PR #36) |
| Tab bar on Home, Android | 50% with blur, cards scroll under it | Solid Daylight, cards stop above it | Android puts the content above the bar, read from `NativeTabsView.android.js` (PR #36) |
| Below the last Evolution card, three-button Android | 26 px from the edge, 8 px into the home indicator area | Stays above the row of buttons | Otherwise the buttons cover the card ([PR #34](https://github.com/Matsu-v/Pokedex/pull/34)) |
| Icons | Vector | PNG at @1x, @2x, @3x | Edge pixels differ per channel by at most 41 of 255 (outline heart), 28 (outline Pokéball), 24 (purple heart) and 15 (red heart) |
| Other phone sizes | One 390x844 frame | Follows the screen | Pixel perfect only exists at that size. Android may also add font padding |

## 3. The course rule goes first: Rubik

Appendix A asks for "the font from the design" with the course's `fonts.zip`. Mats chose Rubik everywhere, because that is the course's font. Sizes and line heights stay Figma's, but text widths change.

| Where | Figma | Effect |
|---|---|---|
| Screen titles, name on Detail | Cabinet Grotesk Extrabold | "All Pokémon" is 146.6 wide against 133 |
| Number on Detail | Cabinet Grotesk | 57.5 wide against 54 |
| Search bar | Inter | |
| Back label on Detail | SF Pro | Button 88.8 wide against 91 |
| Tab labels | SF Pro | Medium weight on Android, see section 2 |

## 4. Figma has sample data, the API replaces it

| Where | Figma | App |
|---|---|---|
| Weight of Bulbasaur | `7,0 kg` | `6,9 kg`, from the API |
| Decimal sign | `7,0 kg` next to `0.7 m` | A comma: Figma contradicts itself, so the spec decides |
| Abilities of Bulbasaur | `Overgrow` | `Overgrow, Chlorophyll` |
| Speed of Charmander | 50 | 65 |
| Order on Favorites | 002, 003, 004, 024 | Newest first |

## 5. Figma has no design for it, so it was added

- Loading and error states with **Try again**, required by appendix A.
- Empty states: Favorites, no results on Search, and "This Pokémon does not evolve."
- Branching evolution chains: Figma only has a straight chain of three. The app goes per stage, with a dotted line between stages only.
- Forms without a sprite: nine of the 1351 ids, all above 10000. The card shows the artwork, and for four forms of Koraidon and Miraidon a Scarlet-Violet image of about 2.7 MB, so those cards do not look like pixel sprites. On Detail and Compare those four stay empty, which was already the case ([PR #39](https://github.com/Matsu-v/Pokedex/pull/39)).
- Pressed opacity on buttons. Larger touch areas through `hitSlop`, which are not visible.
- The Compare button on Detail: required by appendix A. Measured before and after: back, heart and name do not move ([PR #37](https://github.com/Matsu-v/Pokedex/pull/37)).
- The Compare screen: appendix A says "Figma has no screen for this: follow its style", so it is Detail's design language at half width. Type colours only appear as a dot, as in Figma. Its bars are value / 255, unlike Detail, so strong Pokémon stay apart.

## 6. In Figma, but not built

Closed as not planned at the hand-in.

- Splash screen (`1:70`, [#15](https://github.com/Matsu-v/Pokedex/issues/15)).
- Options sheet with Share (`15:4515`, [#13](https://github.com/Matsu-v/Pokedex/issues/13)). The ⋮ on a card is hidden, because a button needs an action. The card keeps Figma's height of 211.
- Collapsing header on Detail (`1:3814`, [#9](https://github.com/Matsu-v/Pokedex/issues/9)).

## 7. What a phone has shown

Mats went through the phone test on an Android phone on SDK 58 and had no remarks. That is an overall judgement, not a result per item. iOS has not been run at all. A failed write on the heart can only be forced on web, so its rollback has not been seen on a phone.

The checklists are in PRs [#31](https://github.com/Matsu-v/Pokedex/pull/31), [#33](https://github.com/Matsu-v/Pokedex/pull/33), [#34](https://github.com/Matsu-v/Pokedex/pull/34), [#35](https://github.com/Matsu-v/Pokedex/pull/35), [#36](https://github.com/Matsu-v/Pokedex/pull/36), [#37](https://github.com/Matsu-v/Pokedex/pull/37) and [#39](https://github.com/Matsu-v/Pokedex/pull/39).
