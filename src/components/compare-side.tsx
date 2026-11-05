import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TypeChip } from '@/components/type-chip';
import {
  Compare,
  Detail,
  FontSize,
  Fonts,
  Radius,
  ScreenTitle,
  SearchBarSize,
  Shadow,
  Spacing,
} from '@/constants/theme';
import type { Pokemon } from '@/data/pokeapi';
import { useTheme } from '@/hooks/use-theme';
import type { Side } from '@/lib/compare';
import { artworkUrl, capitalize } from '@/lib/pokemon';

type CompareSideProps = {
  pokemon: Pokemon;
  /** The columns mirror each other: the text keeps to the outer margin, right above the values. */
  side: Side;
};

/** One Pokémon on Compare: Detail's name and chips at half width, with its artwork below them. */
export function CompareSide({ pokemon, side }: CompareSideProps) {
  const theme = useTheme();
  const isRight = side === 'right';

  return (
    <View style={styles.side}>
      {/* Grows, so both artworks line up when only one side has two rows of chips. */}
      <View style={styles.names}>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={[styles.name, isRight && styles.nameRight, { color: theme.text }]}>
          {capitalize(pokemon.name)}
        </Text>
        <View style={[styles.chips, isRight && styles.chipsRight]}>
          {pokemon.types.map(({ type }) => (
            <TypeChip key={type.name} type={type.name} />
          ))}
        </View>
      </View>
      <Image
        source={artworkUrl(pokemon.id)}
        style={styles.artwork}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

/** The empty right column on Compare: a card in the style of the search bar that opens the picker. */
export function CompareEmptySlot({ onPress }: { onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.slot,
        { backgroundColor: theme.searchBar },
        pressed && styles.pressed,
      ]}>
      <Image
        source={require('@/assets/images/icons/search.png')}
        style={styles.slotIcon}
        tintColor={theme.searchIcon}
      />
      <Text style={[styles.slotLabel, { color: theme.text }]}>Pick a Pokémon</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  side: { flex: 1 },
  names: { flexGrow: 1, gap: Detail.namesGap, marginBottom: Detail.margin },
  name: ScreenTitle,
  nameRight: { textAlign: 'right' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Detail.chipGap },
  chipsRight: { justifyContent: 'flex-end' },
  artwork: { width: Compare.artwork, height: Compare.artwork, alignSelf: 'center' },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radius.s,
    boxShadow: Shadow.soft,
  },
  pressed: { opacity: Compare.pressedOpacity },
  slotIcon: { width: SearchBarSize.icon, height: SearchBarSize.icon },
  slotLabel: { fontFamily: Fonts.medium, fontSize: FontSize.body },
});
