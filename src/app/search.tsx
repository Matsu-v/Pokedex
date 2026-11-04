import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PokemonGrid } from '@/components/pokemon-grid';
import { ErrorState, LoadingState, MessageState } from '@/components/query-state';
import { SearchField } from '@/components/search-bar';
import { useAllPokemonNames } from '@/data/queries/pokemon';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/hooks/use-theme';
import { filterPokemon } from '@/lib/pokemon';

const DEBOUNCE_MS = 250;

export default function SearchScreen() {
  const theme = useTheme();
  const [text, setText] = useState('');
  const debouncedText = useDebouncedValue(text, DEBOUNCE_MS);
  const { data, isPending, refetch } = useAllPokemonNames();
  const query = debouncedText.trim();

  function openDetail(id: number) {
    Keyboard.dismiss();
    router.push(`/pokemon/${id}`);
  }

  function renderContent() {
    // Both: the debounced text is still empty while typing starts, and still full just after clearing.
    if (text.trim() === '' || query === '') return null;

    if (!data) {
      return isPending ? (
        <LoadingState />
      ) : (
        <ErrorState message="Could not load the Pokémon." onRetry={refetch} />
      );
    }

    const results = filterPokemon(data, query);
    if (results.length === 0) return <MessageState message={`No Pokémon found for “${query}”`} />;

    return (
      <PokemonGrid
        items={results}
        onPressItem={openDetail}
        // The options sheet is issue #13.
        onOptionsPressItem={() => {}}
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchField value={text} onChangeText={setText} />
      {/* The window does not resize for the keyboard, so a message or button could end up behind it. */}
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        {renderContent()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
