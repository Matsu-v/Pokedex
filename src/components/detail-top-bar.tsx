import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Detail, FontSize, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// As in Figma. The one place to change it, also for screen readers.
const BACK_LABEL = 'Vorige';

type DetailTopBarProps = {
  onBack: () => void;
  isFavorite: boolean;
  /** Without it the heart shows its state, but is disabled. */
  onToggleFavorite?: () => void;
};

/** Top bar of Detail (1:15396, 1:15399): back button and heart. */
export function DetailTopBar({ onBack, isFavorite, onToggleFavorite }: DetailTopBarProps) {
  const theme = useTheme();

  function pressHeart() {
    // At the press, not after the write: it is immediate, and a quick second tap gets its own.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite?.();
  }

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

      <Pressable
        onPress={pressHeart}
        disabled={!onToggleFavorite}
        hitSlop={Detail.heartHitSlop}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        style={({ pressed }) => [styles.heart, pressed && styles.pressed]}>
        <Image
          source={
            isFavorite
              ? require('@/assets/images/icons/favorite-active.png')
              : require('@/assets/images/icons/favorite.png')
          }
          style={styles.heartIcon}
          tintColor={isFavorite ? theme.favoriteActive : theme.text}
        />
      </Pressable>
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
