import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Compare, Detail, FontSize, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// As in Figma. The one place to change it, also for screen readers.
const BACK_LABEL = 'Vorige';

type TopBarProps = {
  onBack: () => void;
  /** What the screen has on the right. */
  children: ReactNode;
};

/** Top bar of Detail (1:15396): the back button, with the screen's own actions on the right. */
export function TopBar({ onBack, children }: TopBarProps) {
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
        <Text style={[styles.label, { color: theme.backButton }]}>{BACK_LABEL}</Text>
      </Pressable>

      <View style={styles.actions}>{children}</View>
    </View>
  );
}

type TopBarButtonProps = {
  label: string;
  /** Without it the button is disabled. */
  onPress?: () => void;
};

/** Not in Figma: Compare and Swap, in the style of the back button's label. */
export function TopBarButton({ label, onPress }: TopBarButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={Detail.backHitSlop}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        !onPress && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, { color: theme.backButton }]}>{label}</Text>
    </Pressable>
  );
}

type DetailTopBarProps = {
  onBack: () => void;
  onCompare: () => void;
  isFavorite: boolean;
  /** Without it the heart shows its state, but is disabled. */
  onToggleFavorite?: () => void;
};

/** Top bar of Detail (1:15396, 1:15399): back button and heart, with Compare in the free space. */
export function DetailTopBar({ onBack, onCompare, isFavorite, onToggleFavorite }: DetailTopBarProps) {
  const theme = useTheme();

  function pressHeart() {
    // At the press, not after the write: it is immediate, and a quick second tap gets its own.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite?.();
  }

  return (
    <TopBar onBack={onBack}>
      <TopBarButton label="Compare" onPress={onCompare} />
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
    </TopBar>
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
  disabled: { opacity: Compare.disabledOpacity },
  chevron: { width: Detail.chevron.width, height: Detail.chevron.height },
  label: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.back,
    lineHeight: Detail.backLineHeight,
    letterSpacing: Detail.backLetterSpacing,
  },
  actions: { flexDirection: 'row', alignItems: 'center' },
  button: {
    height: Detail.barHeight,
    justifyContent: 'center',
    paddingHorizontal: Detail.backPadding.horizontal,
  },
  heart: { padding: Detail.heartPadding },
  heartIcon: { width: Detail.heartIcon, height: Detail.heartIcon },
});
