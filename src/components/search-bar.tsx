import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FontSize, Fonts, Radius, SearchBarSize, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PLACEHOLDER = 'Search for Pokémon..';

type Props = {
  onPress: () => void;
};

/**
 * Search bar from Figma (1:4712). On Home it only looks like a field: tapping it opens Search.
 * It sits above the list, so its shadow falls over the cards that scroll under it.
 */
export function SearchBar({ onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={PLACEHOLDER}
      style={({ pressed }) => [
        styles.bar,
        { backgroundColor: theme.searchBar },
        pressed && styles.pressed,
      ]}>
      <Image
        source={require('@/assets/images/icons/search.png')}
        style={styles.icon}
        tintColor={theme.searchIcon}
      />
      <Text style={[styles.placeholder, { color: theme.placeholder }]} numberOfLines={1}>
        {PLACEHOLDER}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SearchBarSize.gap,
    marginTop: Spacing.three,
    marginHorizontal: Spacing.three,
    paddingHorizontal: SearchBarSize.paddingHorizontal,
    paddingVertical: SearchBarSize.paddingVertical,
    borderRadius: Radius.s,
    boxShadow: Shadow.soft,
    zIndex: 1,
  },
  pressed: { opacity: SearchBarSize.pressedOpacity },
  icon: { width: SearchBarSize.icon, height: SearchBarSize.icon },
  placeholder: { flex: 1, fontFamily: Fonts.input, fontSize: FontSize.body },
});
