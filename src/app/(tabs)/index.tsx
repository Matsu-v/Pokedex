import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PokemonGrid } from '@/components/pokemon-grid';
import { ErrorState, LoadingState, LoadMoreFooter } from '@/components/query-state';
import { SearchBar } from '@/components/search-bar';
import { usePokemonList } from '@/data/queries/pokemon';
import { useTheme } from '@/hooks/use-theme';

export default function PokemonsScreen() {
  const theme = useTheme();
  const {
    data,
    isPending,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = usePokemonList();

  function loadMore() {
    // After a failed page only Try again retries, otherwise being offline keeps firing requests.
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) fetchNextPage();
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchBar onPress={() => router.push('/search')} />
      {/* `data` goes first: a failed next page sets the error, but the list must stay. */}
      {data ? (
        <PokemonGrid
          items={data}
          title="All Pokémon"
          onPressItem={(id) => router.push(`/pokemon/${id}`)}
          onEndReached={loadMore}
          footer={
            hasNextPage ? (
              <LoadMoreFooter
                isLoading={isFetchingNextPage}
                isError={isFetchNextPageError}
                onRetry={fetchNextPage}
              />
            ) : undefined
          }
        />
      ) : isPending ? (
        <LoadingState />
      ) : (
        <ErrorState message="Could not load the Pokémon." onRetry={refetch} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
