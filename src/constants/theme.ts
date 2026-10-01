/**
 * All colours, spacing, radii and font sizes of the app. Values come from the course Figma file
 * (fileKey yM5t2yGQQ279kiKIwfYyTH). No hex codes anywhere else.
 */

import { Platform } from 'react-native';

// Figma colour styles.
const Palette = {
  midnight: '#0E0940', // Primary/Midnight: text, inactive tab
  purple: '#5631E8', // Primary/Purple: number badge, active tab
  daylight: '#EDF6FF', // Primary/Daylight: screen background
  white: '#FFFFFF',
  artwork: '#F6F6FF', // artwork area behind the sprite on a Pokecard
} as const;

const light = {
  text: Palette.midnight,
  background: Palette.daylight,
  card: Palette.white,
  cardArtwork: Palette.artwork,
  badge: Palette.purple,
  badgeText: Palette.white,
  tabActive: Palette.purple,
  tabInactive: Palette.midnight,
  // Menubar: Daylight at 50% with a 25px background blur.
  tabBar: 'rgba(237, 246, 255, 0.5)',
  // Type chip background: Midnight at 8%.
  chip: 'rgba(14, 9, 64, 0.08)',
};

export const Colors = {
  light,
  // Dark mode is issue #17; until then it matches light.
  dark: light,
} as const;

export type ThemeColor = keyof typeof light;

// "Soft shadow" effect style: 0 2 15 0, #303773 at 15%.
export const Shadow = { soft: '0px 2px 15px 0px rgba(48, 55, 115, 0.15)' } as const;

// Dot colours from the Type chips on page Types (447:2497).
export const TypeColors = {
  normal: '#9099A2',
  fighting: '#CE3F6A',
  flying: '#93A9E2',
  poison: '#AB6AC8',
  ground: '#D87645',
  rock: '#C4BA85',
  bug: '#8FBF2B',
  ghost: '#546AA6',
  steel: '#5A8FA1',
  fire: '#FF4F68',
  water: '#4D90D6',
  grass: '#64BC55',
  electric: '#FFCF00',
  psychic: '#830CB9',
  ice: '#7DE0D0',
  dragon: '#0670BE',
  dark: '#5C5262',
  fairy: '#EB90E6',
  unknown: '#B6B6B6',
  shadow: '#5B5265',
} as const;

export type PokemonType = keyof typeof TypeColors;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = { xs: 4, s: 8, m: 12, l: 16, pill: 99 } as const;

export const FontSize = { tab: 10, badge: 10, body: 16, title: 24 } as const;

// Figma uses Rubik throughout. These are the names the fonts are registered under in the root
// layout (useFonts). Set fontFamily only, no fontWeight: on Android a weight would pick another file.
export const Fonts = {
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  bold: 'Rubik_700Bold',
} as const;

// Pokecard (1:14698), Row variant.
export const Card = {
  padding: 12, // footer around name and options icon
  badgeOffset: 8, // badge from the top-left corner of the artwork
  badgePadding: { top: 4, bottom: 2, horizontal: 6 },
  nameLineHeight: 1.2,
  icon: 24,
  // Extra touch area around the 24px options icon, so the target is 44pt.
  iconHitSlop: 10,
  // Not in Figma: feedback while a finger is on the card or the icon.
  pressedOpacity: 0.7,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
