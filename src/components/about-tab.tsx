import { StyleSheet, Text, View } from 'react-native';

import { Detail, FontSize, Fonts } from '@/constants/theme';
import type { Pokemon } from '@/data/pokeapi';
import { useTheme } from '@/hooks/use-theme';
import {
  capitalize,
  formatAbility,
  formatBaseExperience,
  formatHeight,
  formatNumber,
  formatWeight,
} from '@/lib/pokemon';

/** About tab from Figma (1:15037). A row per fact, so a long list of abilities wraps and stays aligned. */
export function AboutTab({ pokemon }: { pokemon: Pokemon }) {
  return (
    <View style={styles.rows}>
      <Row label="Name" value={capitalize(pokemon.name)} />
      <Row label="ID" value={formatNumber(pokemon.id)} />
      <Row label="Base" value={formatBaseExperience(pokemon.base_experience)} />
      <Row label="Weight" value={formatWeight(pokemon.weight)} />
      <Row label="Height" value={formatHeight(pokemon.height)} />
      <Row label="Types" value={pokemon.types.map(({ type }) => capitalize(type.name)).join(', ')} />
      <Row
        label="Abilities"
        value={pokemon.abilities.map(({ ability }) => formatAbility(ability.name)).join(', ')}
      />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Detail.aboutGap },
  row: { flexDirection: 'row', gap: Detail.aboutGap },
  label: {
    width: Detail.aboutLabelWidth,
    fontFamily: Fonts.semibold,
    fontSize: FontSize.small,
    lineHeight: Detail.aboutLineHeight,
  },
  value: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSize.small,
    lineHeight: Detail.aboutLineHeight,
    opacity: Detail.aboutValueOpacity,
  },
});
