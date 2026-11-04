import type { ReactElement } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { PokemonCard } from '@/components/pokemon-card';
import { ScreenTitle, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PokemonListItem } from '@/lib/pokemon';

type Props = {
  items: PokemonListItem[];
  /** Scrolls along with the list. */
  title?: string;
  onPressItem: (id: number) => void;
  onOptionsPressItem: (id: number) => void;
  onEndReached?: () => void;
  footer?: ReactElement;
};

/** The two-column grid of Pokecards from Figma (1:835): 24 + 163 + 16 + 163 + 24 = 390. */
export function PokemonGrid({
  items,
  title,
  onPressItem,
  onOptionsPressItem,
  onEndReached,
  footer,
}: Props) {
  const theme = useTheme();
  // A card has `flex: 1`, so a lone card in the last row would fill it. An empty cell keeps it at half.
  const cells: (PokemonListItem | null)[] = items.length % 2 === 1 ? [...items, null] : items;

  return (
    <FlatList
      data={cells}
      numColumns={2}
      keyExtractor={(cell) => (cell ? String(cell.id) : 'empty')}
      renderItem={({ item: cell }) =>
        cell ? (
          <PokemonCard
            id={cell.id}
            name={cell.name}
            onPress={() => onPressItem(cell.id)}
            onOptionsPress={() => onOptionsPressItem(cell.id)}
          />
        ) : (
          <View style={styles.emptyCell} />
        )
      }
      ListHeaderComponent={
        title ? (
          <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>
        ) : undefined
      }
      ListFooterComponent={footer}
      ItemSeparatorComponent={RowGap}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      // With the keyboard up, the first tap on a card would otherwise only close the keyboard.
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
}

// A separator and not `gap` on the content: the spacers of a virtualized list would get a gap too.
function RowGap() {
  return <View style={styles.rowGap} />;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.three,
  },
  title: { ...ScreenTitle, marginBottom: Spacing.three },
  row: { gap: Spacing.three },
  rowGap: { height: Spacing.three },
  emptyCell: { flex: 1 },
});
