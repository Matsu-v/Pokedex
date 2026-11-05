import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** First load of a query: takes the whole space of the content. */
export function LoadingState() {
  const theme = useTheme();

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.spinner} accessibilityLabel="Loading" />
    </View>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  /** For half a screen, such as a column on Compare: without this the button text wraps there. */
  compact?: boolean;
};

/** A query without data that failed: takes the whole space of the content. */
export function ErrorState({ message, onRetry, compact = false }: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.center, compact && styles.compact]}>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      <TryAgainButton onPress={onRetry} />
    </View>
  );
}

/** A message instead of content, such as an empty result: takes the whole space of the content. */
export function MessageState({ message }: { message: string }) {
  const theme = useTheme();

  return (
    <View style={styles.center}>
      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
    </View>
  );
}

type LoadMoreFooterProps = {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

/**
 * Below a list that has more pages: spinner while the next page loads, Try again when it failed.
 * The stopped spinner keeps its space, otherwise the spinner starts below the end of the screen.
 */
export function LoadMoreFooter({ isLoading, isError, onRetry }: LoadMoreFooterProps) {
  const theme = useTheme();

  // A retry is both loading and error: it keeps its error until it succeeds. So loading goes first.
  if (isError && !isLoading) {
    return (
      <View style={styles.footer}>
        <Text style={[styles.message, { color: theme.text }]}>Could not load more Pokémon.</Text>
        <TryAgainButton onPress={onRetry} />
      </View>
    );
  }

  return (
    <View style={styles.footer}>
      <ActivityIndicator
        size="small"
        color={theme.spinner}
        animating={isLoading}
        accessibilityLabel={isLoading ? 'Loading more' : undefined}
      />
    </View>
  );
}

function TryAgainButton({ onPress }: { onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onPress()}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.button },
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.buttonText, { color: theme.buttonText }]}>Try again</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  compact: { paddingHorizontal: 0 },
  footer: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  message: { fontFamily: Fonts.regular, fontSize: FontSize.body, textAlign: 'center' },
  button: {
    minHeight: Button.minHeight,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.s,
  },
  pressed: { opacity: Button.pressedOpacity },
  buttonText: { fontFamily: Fonts.medium, fontSize: FontSize.body },
});
