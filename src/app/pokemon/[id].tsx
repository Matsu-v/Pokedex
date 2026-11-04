import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaceholderScreen title={`Pokémon ${id}`} message="The details come here." edges={[]} />;
}
