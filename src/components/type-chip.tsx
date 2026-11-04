import { StyleSheet, Text, View } from 'react-native';

import { Detail, FontSize, Fonts, Radius, typeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { capitalize } from '@/lib/pokemon';

/** Type chip from Figma (447:2508): a dot in the colour of the type, and its name. */
export function TypeChip({ type }: { type: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.chip, { backgroundColor: theme.chip }]}>
      <View style={[styles.dot, { backgroundColor: typeColor(type) }]} />
      <Text style={[styles.label, { color: theme.text }]}>{capitalize(type)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Detail.chipGap,
    paddingLeft: Detail.chipPadding.left,
    paddingRight: Detail.chipPadding.right,
    paddingVertical: Detail.chipPadding.vertical,
    borderRadius: Radius.pill,
  },
  dot: {
    width: Detail.chipDot,
    height: Detail.chipDot,
    borderRadius: Radius.pill,
  },
  label: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.body,
    lineHeight: Detail.chipLineHeight,
  },
});
