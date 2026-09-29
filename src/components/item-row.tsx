import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Item } from '@/constants/items';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { item: Item; onPress: () => void };

export function ItemRow({ item, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { backgroundColor: theme.card, opacity: pressed ? 0.6 : 1 }]}>
      <View style={styles.text}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={{ color: theme.textSecondary }}>{item.effect}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: theme.badge }]}>
        <Text style={{ color: theme.badgeText }}>{item.category}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.m,
    boxShadow: '0 1px 4px rgba(34, 48, 60, 0.12)',
  },
  text: { flex: 1, gap: Spacing.one },
  name: { fontSize: 17, fontWeight: 'bold' },
  badge: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.half, borderRadius: Radius.s },
});
