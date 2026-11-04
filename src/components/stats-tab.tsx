import { StyleSheet, Text, View } from 'react-native';

import { Detail, FontSize, Fonts, Radius } from '@/constants/theme';
import type { Pokemon } from '@/data/pokeapi';
import { useTheme } from '@/hooks/use-theme';
import { formatStatName, statBarWidth } from '@/lib/pokemon';

/** Stats tab from Figma (1:15187). The API gives the six stats in the order Figma shows them. */
export function StatsTab({ pokemon }: { pokemon: Pokemon }) {
  const theme = useTheme();

  return (
    <View style={styles.stats}>
      {pokemon.stats.map(({ stat, base_stat }) => (
        <View key={stat.name} style={styles.stat}>
          <View style={styles.labels}>
            <Text style={[styles.label, { color: theme.text }]}>{formatStatName(stat.name)}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{base_stat}</Text>
          </View>
          <View style={[styles.track, { backgroundColor: theme.detailStatTrack }]}>
            <View
              style={[
                styles.bar,
                { backgroundColor: theme.detailStatBar, width: statBarWidth(base_stat) },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { gap: Detail.statsGap },
  stat: { gap: Detail.statBarGap },
  labels: { flexDirection: 'row' },
  label: {
    flex: 1,
    fontFamily: Fonts.semibold,
    fontSize: FontSize.small,
    lineHeight: Detail.statLineHeight,
  },
  value: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.small,
    lineHeight: Detail.statLineHeight,
    opacity: Detail.statValueOpacity,
  },
  track: { height: Detail.statBarHeight, borderRadius: Radius.pill, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: Radius.pill },
});
