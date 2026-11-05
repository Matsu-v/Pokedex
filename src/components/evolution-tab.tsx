import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { PokemonListCard } from '@/components/pokemon-card';
import { MessageState } from '@/components/query-state';
import { Detail } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PokemonListItem } from '@/lib/pokemon';

type Props = {
  stages: PokemonListItem[][];
  /** The Pokémon on screen: it is already open, so its card is not a button. */
  currentId: number;
  onPressItem: (id: number) => void;
};

/**
 * Evolution tab from Figma (1:15252): a dotted line between the stages, the cards of one stage below
 * each other. So a branching chain does not show which branch becomes what (Silcoon → Beautifly).
 */
export function EvolutionTab({ stages, currentId, onPressItem }: Props) {
  if (stages.length < 2) return <MessageState message="This Pokémon does not evolve." />;

  return (
    <View style={styles.chain}>
      {stages.map((stage, index) => (
        <Fragment key={stage[0].id}>
          {index > 0 && <EvolutionLine />}
          {stage.map(({ id, name }) => (
            <PokemonListCard
              key={id}
              id={id}
              name={name}
              onPress={id === currentId ? undefined : () => onPressItem(id)}
            />
          ))}
        </Fragment>
      ))}
    </View>
  );
}

function EvolutionLine() {
  const theme = useTheme();
  const colour = { backgroundColor: theme.detailEvolutionLine };

  return (
    <View style={styles.line}>
      <View style={[styles.endDash, colour]} />
      <View style={[styles.middleDash, colour]} />
      <View style={[styles.endDash, colour]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chain: { gap: Detail.evolutionGap },
  line: {
    width: Detail.evolutionLine.width,
    height: Detail.evolutionLine.height,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  endDash: { width: Detail.evolutionLine.stroke, height: Detail.evolutionLine.endDash },
  middleDash: { width: Detail.evolutionLine.stroke, height: Detail.evolutionLine.middleDash },
});
