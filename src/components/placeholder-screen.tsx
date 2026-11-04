import { StyleSheet, Text } from 'react-native';
import { type Edges, SafeAreaView } from 'react-native-safe-area-context';

import { FontSize, ScreenTitle, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  message: string;
  /** Pass `[]` under a stack header, which already keeps the screen clear of the status bar. */
  edges?: Edges;
};

export function PlaceholderScreen({ title, message, edges = ['top'] }: Props) {
  const theme = useTheme();

  return (
    <SafeAreaView edges={edges} style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.four, gap: Spacing.two },
  title: ScreenTitle,
  message: { fontSize: FontSize.body },
});
