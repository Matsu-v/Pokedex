import type { UseQueryResult } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompareEmptySlot, CompareSide } from '@/components/compare-side';
import { CompareStats } from '@/components/compare-stats';
import { TopBar, TopBarButton } from '@/components/detail-top-bar';
import { ErrorState, LoadingState, MessageState } from '@/components/query-state';
import { Compare, Detail } from '@/constants/theme';
import type { Pokemon } from '@/data/pokeapi';
import { usePokemon } from '@/data/queries/pokemon';
import { useTheme } from '@/hooks/use-theme';
import type { Side } from '@/lib/compare';

export default function CompareScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { a, b } = useLocalSearchParams<{ a: string; b?: string }>();
  const left = usePokemon(Number(a));
  const right = usePokemon(b === undefined ? undefined : Number(b));

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar onBack={() => router.back()}>
        <TopBarButton
          label="Swap"
          // Through the params, so they always say what is on screen.
          onPress={b === undefined ? undefined : () => router.setParams({ a: b, b: a })}
        />
      </TopBar>

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <View style={styles.sides}>
          <View style={styles.column}>
            <SideContent query={left} side="left" />
          </View>
          <View style={styles.column}>
            {b === undefined ? (
              <CompareEmptySlot
                onPress={() => router.push({ pathname: '/search', params: { compareWith: a } })}
              />
            ) : (
              <SideContent query={right} side="right" />
            )}
          </View>
        </View>

        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.detailSheet, paddingBottom: insets.bottom + Detail.bottomGap },
          ]}>
          {left.data && right.data ? (
            <CompareStats left={left.data} right={right.data} />
          ) : (
            b === undefined && (
              <MessageState message="Choose a second Pokémon to see who is stronger." />
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SideContentProps = {
  query: UseQueryResult<Pokemon>;
  side: Side;
};

/** Each side has its own states: one that fails leaves the other on screen. */
function SideContent({ query, side }: SideContentProps) {
  // `data` goes first: a failed refetch sets the error, but what is there must stay.
  if (query.data) return <CompareSide pokemon={query.data} side={side} />;
  if (query.isPending) return <LoadingState />;
  return <ErrorState message="Could not load this Pokémon." onRetry={query.refetch} compact />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
  sides: {
    flexDirection: 'row',
    gap: Compare.columnGap,
    paddingTop: Detail.margin,
    paddingHorizontal: Detail.margin,
    marginBottom: -Compare.artworkOnSheet,
    // Above the white part, which comes later: the artworks hang over it, as on Detail.
    zIndex: 1,
  },
  column: { flex: 1, minHeight: Compare.columnMinHeight },
  sheet: {
    flexGrow: 1,
    paddingHorizontal: Detail.margin,
    paddingTop: Compare.artworkOnSheet + Detail.margin,
  },
});
