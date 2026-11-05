import { StyleSheet, Text, View } from 'react-native';

import { Compare, Detail, FontSize, Fonts, Radius, typeColor } from '@/constants/theme';
import type { Pokemon } from '@/data/pokeapi';
import { useTheme } from '@/hooks/use-theme';
import { compareBarWidth, compareStats, type ComparedValue, type Side } from '@/lib/compare';
import { capitalize, formatStatName } from '@/lib/pokemon';

type Props = {
  left: Pokemon;
  right: Pokemon;
};

/** The six stats, the total and the verdict, in the styles of Detail's Stats tab (1:15187). */
export function CompareStats({ left, right }: Props) {
  const theme = useTheme();
  const { rows, total, verdict } = compareStats(left, right);

  return (
    <View style={styles.stats}>
      {rows.map((row) => (
        <View key={row.name} style={styles.stat}>
          <CompareValues label={formatStatName(row.name)} compared={row} left={left} right={right} />
          <View style={styles.bars}>
            <Bar value={row.left} side="left" />
            <Bar value={row.right} side="right" />
          </View>
        </View>
      ))}
      <CompareValues label="Total" compared={total} left={left} right={right} />
      <Text style={[styles.verdict, { color: theme.text }]}>{verdict}</Text>
    </View>
  );
}

type CompareValuesProps = Props & {
  label: string;
  compared: ComparedValue;
};

function CompareValues({ label, compared, left, right }: CompareValuesProps) {
  const theme = useTheme();
  const leftName = capitalize(left.name);
  const rightName = capitalize(right.name);

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${leftName} ${compared.left}, ${rightName} ${compared.right}`}
      style={styles.values}>
      <Value value={compared.left} side="left" winner={compared.winner} pokemon={left} />
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Value value={compared.right} side="right" winner={compared.winner} pokemon={right} />
    </View>
  );
}

type ValueProps = {
  value: number;
  side: Side;
  winner: Side | null;
  pokemon: Pokemon;
};

/**
 * One number at the outer edge of its half. The higher one is bold with a dot in the colour of the
 * first type, which is how Figma shows a type colour: as text, eight of them stay below 3:1 on white.
 */
function Value({ value, side, winner, pokemon }: ValueProps) {
  const theme = useTheme();
  const isWinner = winner === side;

  return (
    <View style={[styles.value, side === 'right' && styles.valueRight]}>
      <Text style={[isWinner ? styles.winner : styles.number, { color: theme.text }]}>{value}</Text>
      {isWinner && (
        <View style={[styles.dot, { backgroundColor: typeColor(pokemon.types[0].type.name) }]} />
      )}
    </View>
  );
}

/** A bar that grows from the middle of the row to the outside. */
function Bar({ value, side }: { value: number; side: Side }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.track,
        side === 'left' && styles.trackLeft,
        { backgroundColor: theme.detailStatTrack },
      ]}>
      <View
        style={[styles.bar, { backgroundColor: theme.detailStatBar, width: compareBarWidth(value) }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { gap: Detail.statsGap },
  stat: { gap: Detail.statBarGap },
  values: { flexDirection: 'row' },
  label: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.small,
    lineHeight: Detail.statLineHeight,
  },
  // Both halves take the same width, so the label stays in the middle whatever is next to it.
  value: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Detail.chipGap },
  valueRight: { flexDirection: 'row-reverse' },
  number: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.small,
    lineHeight: Detail.statLineHeight,
    opacity: Detail.statValueOpacity,
  },
  winner: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.small,
    lineHeight: Detail.statLineHeight,
  },
  // The dot of the type chip.
  dot: { width: Detail.chipDot, height: Detail.chipDot, borderRadius: Radius.pill },
  bars: { flexDirection: 'row', gap: Compare.barGap },
  track: { flex: 1, height: Detail.statBarHeight, borderRadius: Radius.pill, overflow: 'hidden' },
  trackLeft: { alignItems: 'flex-end' },
  bar: { height: '100%', borderRadius: Radius.pill },
  verdict: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.body,
    lineHeight: Compare.verdictLineHeight,
    textAlign: 'center',
  },
});
