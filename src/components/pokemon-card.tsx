import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, FontSize, Fonts, Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { artworkUrl, capitalize, formatNumber } from '@/lib/pokemon';

type Props = {
  id: number;
  name: string;
  onPress: () => void;
  onOptionsPress: () => void;
};

/**
 * Pokecard from Figma (1:14698, Row variant): number badge, artwork, name and ⋮ button.
 * Takes the width its parent gives it (`flex: 1`); the artwork stays square.
 */
export function PokemonCard({ id, name, onPress, onOptionsPress }: Props) {
  const theme = useTheme();
  const displayName = capitalize(name);
  const number = formatNumber(id);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, number ${number}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.artwork, { backgroundColor: theme.cardArtwork }]}>
        <Image
          source={artworkUrl(id)}
          style={styles.image}
          contentFit="contain"
          accessibilityIgnoresInvertColors
        />
        <View style={[styles.badge, { backgroundColor: theme.badge }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>{number}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {displayName}
        </Text>
        <Pressable
          onPress={onOptionsPress}
          hitSlop={Card.iconHitSlop}
          accessibilityRole="button"
          accessibilityLabel={`Options for ${displayName}`}
          style={({ pressed }) => pressed && styles.pressed}>
          <Image
            source={require('@/assets/images/icons/options.png')}
            style={styles.icon}
            tintColor={theme.text}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.s,
    boxShadow: Shadow.soft,
  },
  pressed: { opacity: Card.pressedOpacity },
  artwork: {
    aspectRatio: 1,
    borderTopLeftRadius: Radius.s,
    borderTopRightRadius: Radius.s,
    overflow: 'hidden',
  },
  image: { flex: 1 },
  badge: {
    position: 'absolute',
    top: Card.badgeOffset,
    left: Card.badgeOffset,
    borderRadius: Radius.xs,
    paddingTop: Card.badgePadding.top,
    paddingBottom: Card.badgePadding.bottom,
    paddingHorizontal: Card.badgePadding.horizontal,
  },
  badgeText: { fontFamily: Fonts.medium, fontSize: FontSize.badge },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Card.padding,
  },
  name: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
    lineHeight: FontSize.body * Card.nameLineHeight,
  },
  icon: { width: Card.icon, height: Card.icon },
});
