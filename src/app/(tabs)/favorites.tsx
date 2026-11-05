import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GridTitle, PokemonGrid } from '@/components/pokemon-grid';
import { ErrorState, LoadingState, MessageState } from '@/components/query-state';
import { Spacing } from '@/constants/theme';
import { useFavorites } from '@/data/queries/favorites';
import { useTheme } from '@/hooks/use-theme';

const TITLE = 'My favorites';

export default function FavoritesScreen() {
  const theme = useTheme();
  const { data, isPending, refetch } = useFavorites();

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {data && data.length > 0 ? (
        <PokemonGrid
          items={data}
          title={TITLE}
          topGap={Spacing.four}
          onPressItem={(id) => router.push(`/pokemon/${id}`)}
          // The options sheet is issue #13.
          onOptionsPressItem={() => {}}
        />
      ) : (
        <>
          {/* The title needs no data, so it stays in the same place in all these states. */}
          <View style={styles.titleWithoutGrid}>
            <GridTitle title={TITLE} />
          </View>
          {/* `data` goes first: a failed refetch sets the error, but what is there must stay. */}
          {data ? (
            <MessageState message="No favorites yet. Tap the heart on a Pokémon to add it here." />
          ) : isPending ? (
            <LoadingState />
          ) : (
            <ErrorState message="Could not load your favorites." onRetry={refetch} />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleWithoutGrid: { paddingTop: Spacing.four, paddingHorizontal: Spacing.four },
});
