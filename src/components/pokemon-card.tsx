import { Image } from 'expo-image';
import { useState } from 'react';
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
import { capitalize, cardImageUrls, formatNumber } from '@/lib/pokemon';

type Props = {
  id: number;
  name: string;
  onPress: () => void;
};

/**
 * The image on a card: the sprite, and when a URL fails the next one from `cardImageUrls`. All drawing
 * of the image happens here. Cards are keyed by id, so a new id is a new instance and starts over.
 */
function CardImage({ id }: { id: number }) {
  const urls = cardImageUrls(id);
  const [index, setIndex] = useState(0);

  return (
    <Image
      source={urls[index]}
      style={styles.image}
      contentFit="contain"
      accessibilityIgnoresInvertColors
      onError={() => setIndex(Math.min(index + 1, urls.length - 1))}
    />
  );
}

/**
 * Pokecard from Figma (1:14698, Row variant): number badge, sprite and name. Figma's ⋮ button is left
 * out: it belongs to the options sheet, which was not built (#13), and a button needs an action.
 * Takes the width its parent gives it (`flex: 1`); the image stays square.
 */
export function PokemonCard({ id, name, onPress }: Props) {
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
        <CardImage id={id} />
        <NumberBadge number={number} style={styles.badgeOnArtwork} />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {displayName}
        </Text>
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
 * Pokecard from Figma (1:14699, List variant): sprite on the left, number and name next to it.
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
        <CardImage id={id} />
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
    minHeight: Card.footerHeight,
    justifyContent: 'center',
    paddingHorizontal: Card.padding,
  },
  name: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
    lineHeight: FontSize.body * Card.nameLineHeight,
  },
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
