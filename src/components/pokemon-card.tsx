import { Image } from 'expo-image';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

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
        <NumberBadge number={number} style={styles.badgeOnArtwork} />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.name, styles.footerName, { color: theme.text }]} numberOfLines={1}>
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

type ListCardProps = {
  id: number;
  name: string;
  /** Leave it out for a card that opens nothing: then it is not a button either. */
  onPress?: () => void;
};

/**
 * Pokecard from Figma (1:14699, List variant): artwork on the left, number and name next to it.
 * Takes the width its parent gives it.
 */
export function PokemonListCard({ id, name, onPress }: ListCardProps) {
  const theme = useTheme();
  const displayName = capitalize(name);
  const number = formatNumber(id);
  const label = `${displayName}, number ${number}`;

  const content = (
    <>
      <View style={[styles.listArtwork, { backgroundColor: theme.cardArtwork }]}>
        <Image
          source={artworkUrl(id)}
          style={styles.image}
          contentFit="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
      <View style={styles.listBody}>
        <NumberBadge number={number} style={styles.badgeInList} />
        <Text style={[styles.name, styles.listName, { color: theme.text }]} numberOfLines={1}>
          {displayName}
        </Text>
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View
        accessible
        accessibilityLabel={label}
        style={[styles.listCard, { backgroundColor: theme.card }]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.listCard,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
      ]}>
      {content}
    </Pressable>
  );
}

function NumberBadge({ number, style }: { number: string; style: StyleProp<ViewStyle> }) {
  const theme = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: theme.badge }, style]}>
      <Text style={[styles.badgeText, { color: theme.badgeText }]}>{number}</Text>
    </View>
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
    borderRadius: Radius.xs,
    paddingTop: Card.badgePadding.top,
    paddingBottom: Card.badgePadding.bottom,
    paddingHorizontal: Card.badgePadding.horizontal,
  },
  badgeOnArtwork: {
    position: 'absolute',
    top: Card.badgeOffset,
    left: Card.badgeOffset,
  },
  badgeInList: { alignSelf: 'flex-start' },
  badgeText: { fontFamily: Fonts.medium, fontSize: FontSize.badge },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Card.padding,
  },
  name: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
    lineHeight: FontSize.body * Card.nameLineHeight,
  },
  footerName: { flex: 1 },
  icon: { width: Card.icon, height: Card.icon },
  listCard: {
    flexDirection: 'row',
    borderRadius: Radius.s,
    boxShadow: Shadow.soft,
  },
  listArtwork: {
    width: Card.listArtwork,
    height: Card.listArtwork,
    borderTopLeftRadius: Radius.s,
    borderBottomLeftRadius: Radius.s,
    overflow: 'hidden',
  },
  listBody: {
    flex: 1,
    justifyContent: 'center',
    gap: Card.listGap,
    padding: Card.padding,
  },
  listName: { lineHeight: Card.listNameLineHeight },
});
