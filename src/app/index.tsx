import { Alert, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemRow } from '@/components/item-row';
import { itemData } from '@/constants/items';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ItemsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>All items</Text>
      <FlatList
        data={itemData}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: Spacing.two, paddingBottom: Spacing.three }}
        renderItem={({ item }) => <ItemRow item={item} onPress={() => Alert.alert(item.name)} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.three },
  title: { fontSize: 28, fontWeight: 'bold', paddingVertical: Spacing.two },
});
