import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutTab } from '@/components/about-tab';
import { DetailTabs, type DetailTab } from '@/components/detail-tabs';
import { DetailTopBar } from '@/components/detail-top-bar';
import { EvolutionTab } from '@/components/evolution-tab';
import { ErrorState, LoadingState } from '@/components/query-state';
import { StatsTab } from '@/components/stats-tab';
import { TypeChip } from '@/components/type-chip';
import { Detail, evolutionBottomPadding, FontSize, Fonts } from '@/constants/theme';
import type { Pokemon } from '@/data/pokeapi';
import { useIsFavorite, useToggleFavorite } from '@/data/queries/favorites';
import { useEvolutionStages, usePokemon } from '@/data/queries/pokemon';
import { useTheme } from '@/hooks/use-theme';
import { artworkUrl, capitalize, formatNumber, idFromUrl } from '@/lib/pokemon';

export default function PokemonDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pokemon, isPending, refetch } = usePokemon(Number(id));
  // One local row, no visible loading or error state: see the rule in AGENTS.md.
  const { data: isFavorite = false } = useIsFavorite(Number(id));
  const { mutate: toggleFavorite } = useToggleFavorite();

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/*
        Outside the query: going back must also work while loading or after an error. The heart waits
        for `pokemon`, because a favourite stores the name.
      */}
      <DetailTopBar
        onBack={() => router.back()}
        onCompare={() => router.push({ pathname: '/compare', params: { a: id } })}
        isFavorite={isFavorite}
        onToggleFavorite={pokemon && (() => toggleFavorite({ id: pokemon.id, name: pokemon.name }))}
      />
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
          {
            backgroundColor: theme.detailSheet,
            paddingBottom:
              tab === 'evolution'
                ? evolutionBottomPadding(insets.bottom)
                : insets.bottom + Detail.bottomGap,
          },
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
          {tab === 'about' && <AboutTab pokemon={pokemon} />}
          {tab === 'stats' && <StatsTab pokemon={pokemon} />}
          {tab === 'evolution' && <EvolutionSection pokemon={pokemon} />}
        </View>
      </View>
    </ScrollView>
  );
}

/** Rendered only on its own tab, so the chain loads when the tab opens and an error stays in the tab. */
function EvolutionSection({ pokemon }: { pokemon: Pokemon }) {
  // Not `pokemon.id`: a form such as Charizard Mega X (10034) belongs to species 6.
  const { stages, isPending, refetch } = useEvolutionStages(idFromUrl(pokemon.species.url));

  if (stages) {
    return (
      <EvolutionTab
        stages={stages}
        currentId={pokemon.id}
        onPressItem={(id) => router.push(`/pokemon/${id}`)}
      />
    );
  }
  if (isPending) return <LoadingState />;
  return <ErrorState message="Could not load the evolution chain." onRetry={refetch} />;
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
  // Grows, so the loading, error and message states centre in the rest of the white part.
  tabContent: { flexGrow: 1, marginTop: Detail.margin },
});
