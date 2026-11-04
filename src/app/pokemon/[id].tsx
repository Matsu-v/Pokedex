import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutTab } from '@/components/about-tab';
import { DetailTabs, type DetailTab } from '@/components/detail-tabs';
import { DetailTopBar } from '@/components/detail-top-bar';
import { ErrorState, LoadingState } from '@/components/query-state';
import { TypeChip } from '@/components/type-chip';
import { Detail, FontSize, Fonts } from '@/constants/theme';
import type { Pokemon } from '@/data/pokeapi';
import { usePokemon } from '@/data/queries/pokemon';
import { useTheme } from '@/hooks/use-theme';
import { artworkUrl, capitalize, formatNumber } from '@/lib/pokemon';

export default function PokemonDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pokemon, isPending, refetch } = usePokemon(Number(id));

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Outside the query: going back must also work while loading or after an error. */}
      <DetailTopBar onBack={() => router.back()} />
      {/* `pokemon` goes first: a failed refetch sets the error, but what is there must stay. */}
      {pokemon ? (
        <DetailContent pokemon={pokemon} />
      ) : isPending ? (
        <LoadingState />
      ) : (
        <ErrorState message="Could not load this Pokémon." onRetry={refetch} />
      )}
    </SafeAreaView>
  );
}

function DetailContent({ pokemon }: { pokemon: Pokemon }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<DetailTab>('about');

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}>
      <View style={styles.names}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {capitalize(pokemon.name)}
          </Text>
          <Text style={[styles.number, { color: theme.text }]}>#{formatNumber(pokemon.id)}</Text>
        </View>
        <View style={styles.chips}>
          {pokemon.types.map(({ type }) => (
            <TypeChip key={type.name} type={type.name} />
          ))}
        </View>
      </View>

      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.detailSheet, paddingBottom: insets.bottom + Detail.margin },
        ]}>
        {/* In the white part with a negative margin, so it paints over the daylight above it. */}
        <Image
          source={artworkUrl(pokemon.id)}
          style={styles.artwork}
          contentFit="contain"
          accessibilityIgnoresInvertColors
        />
        <DetailTabs active={tab} onChange={setTab} />
        <View style={styles.tabContent}>
          {/* Stats is issue #7, Evolution is issue #8. */}
          {tab === 'about' && <AboutTab pokemon={pokemon} />}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
  names: {
    paddingTop: Detail.margin,
    paddingHorizontal: Detail.margin,
    paddingBottom: Detail.margin + Detail.artworkOnDaylight,
    gap: Detail.namesGap,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Detail.chipGap,
  },
  name: {
    flexShrink: 1,
    fontFamily: Fonts.title,
    fontSize: FontSize.heading,
    lineHeight: Detail.titleLineHeight,
  },
  number: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.title,
    lineHeight: Detail.titleLineHeight,
    opacity: Detail.numberOpacity,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Detail.chipGap },
  sheet: {
    flexGrow: 1,
    paddingHorizontal: Detail.margin,
  },
  artwork: {
    width: Detail.artwork,
    height: Detail.artwork,
    alignSelf: 'center',
    marginTop: -Detail.artworkOnDaylight,
    marginBottom: Detail.margin,
  },
  tabContent: { marginTop: Detail.margin },
});
