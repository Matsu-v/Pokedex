import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontSize, Fonts, Radius, SearchBarSize, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PLACEHOLDER = 'Search for Pokémon..';

type SearchBarProps = {
  onPress: () => void;
};

/**
 * Search bar from Figma (1:4712). On Home it only looks like a field: tapping it opens Search.
 * It sits above the list, so its shadow falls over the cards that scroll under it.
 */
export function SearchBar({ onPress }: SearchBarProps) {
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
      <SearchIcon />
      <Text style={[styles.text, { color: theme.placeholder }]} numberOfLines={1}>
        {PLACEHOLDER}
      </Text>
    </Pressable>
  );
}

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
};

/**
 * The same bar as a real text field, on Search (1:836). The keyboard opens along with the screen and
 * starts in lower case, as in Figma.
 */
export function SearchField({ value, onChangeText }: SearchFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.bar, { backgroundColor: theme.searchBar }]}>
      <SearchIcon />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        placeholder={PLACEHOLDER}
        placeholderTextColor={theme.placeholder}
        selectionColor={theme.searchCaret}
        cursorColor={theme.searchCaret}
        accessibilityLabel={PLACEHOLDER}
        style={[styles.text, styles.input, { color: theme.searchText }]}
      />
    </View>
  );
}

function SearchIcon() {
  const theme = useTheme();

  return (
    <Image
      source={require('@/assets/images/icons/search.png')}
      style={styles.icon}
      tintColor={theme.searchIcon}
    />
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
  text: { flex: 1, fontFamily: Fonts.regular, fontSize: FontSize.body },
  // Android gives a text field its own padding, which would make the bar higher than Home's.
  input: { padding: 0 },
});
