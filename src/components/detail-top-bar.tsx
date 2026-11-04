import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Detail, FontSize, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// As in Figma. The one place to change it, also for screen readers.
const BACK_LABEL = 'Vorige';

/**
 * Top bar of Detail (1:15396, 1:15399): back button and heart. The heart is only an image for now:
 * issue #11 makes it a button.
 */
export function DetailTopBar({ onBack }: { onBack: () => void }) {
  const theme = useTheme();

  return (
    <View style={styles.bar}>
      <Pressable
        onPress={onBack}
        hitSlop={Detail.backHitSlop}
        accessibilityRole="button"
        accessibilityLabel={BACK_LABEL}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <Image
          source={require('@/assets/images/icons/chevron-left.png')}
          style={styles.chevron}
          tintColor={theme.backButton}
        />
        <Text style={[styles.backLabel, { color: theme.backButton }]}>{BACK_LABEL}</Text>
      </Pressable>

      <View style={styles.heart}>
        <Image
          source={require('@/assets/images/icons/favorite.png')}
          style={styles.heartIcon}
          tintColor={theme.text}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Detail.barOffset,
    marginHorizontal: Detail.barOffset,
    height: Detail.barHeight,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Detail.backGap,
    paddingHorizontal: Detail.backPadding.horizontal,
    paddingVertical: Detail.backPadding.vertical,
  },
  pressed: { opacity: Detail.pressedOpacity },
  chevron: { width: Detail.chevron.width, height: Detail.chevron.height },
  backLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.back,
    lineHeight: Detail.backLineHeight,
    letterSpacing: Detail.backLetterSpacing,
  },
  heart: { padding: Detail.heartPadding },
  heartIcon: { width: Detail.heartIcon, height: Detail.heartIcon },
});
