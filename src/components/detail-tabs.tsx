import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Detail, FontSize, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TABS = [
  { key: 'about', label: 'About' },
  { key: 'stats', label: 'Stats' },
  { key: 'evolution', label: 'Evolution' },
] as const;

export type DetailTab = (typeof TABS)[number]['key'];

type Props = {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
};

/** Tabs from Figma (1131:2631), at the size Detail uses them (1131:3491). Local state, not routes. */
export function DetailTabs({ active, onChange }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.tabs} accessibilityRole="tablist">
      {TABS.map(({ key, label }) => {
        const selected = key === active;

        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="tab"
            aria-selected={selected}
            style={[
              styles.tab,
              { borderBottomColor: selected ? theme.detailTabLineActive : theme.detailTabLine },
            ]}>
            <Text style={[styles.label, { color: theme.text }, !selected && styles.labelInactive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row' },
  tab: {
    flex: 1,
    paddingTop: Detail.tabPadding.top,
    paddingBottom: Detail.tabPadding.bottom,
    borderBottomWidth: Detail.tabLine,
  },
  label: {
    fontFamily: Fonts.semibold,
    fontSize: FontSize.small,
    lineHeight: Detail.tabLineHeight,
    textAlign: 'center',
  },
  labelInactive: { opacity: Detail.tabInactiveOpacity },
});
