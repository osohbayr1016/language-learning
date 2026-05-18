import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../../primitives';
import { spacing } from '../../../theme';
import { mn } from '../../../i18n/mn';
import { GameHud } from '../GameHud';
import type { MatchCard } from './cards';
import type { Word } from '../../../lib/types';
import { MatchTile } from './MatchTile';

type P = {
  score: number;
  combo: number;
  elapsedSeconds: number | null;
  overallMatched: number;
  total: number;
  onRestart: () => void;
  deck: MatchCard[];
  wordsById: Record<number, Word>;
  stateOf: (c: MatchCard) => 'idle' | 'selected' | 'matched' | 'wrong';
  onTapCard: (c: MatchCard) => void;
};

export function MatchPlayingView({
  score,
  combo,
  elapsedSeconds,
  overallMatched,
  total,
  onRestart,
  deck,
  wordsById,
  stateOf,
  onTapCard,
}: P) {
  return (
    <Screen scroll>
      <GameHud
        title={mn.games.match}
        score={score}
        combo={combo}
        elapsedSeconds={elapsedSeconds}
        onRestart={onRestart}
        progressLabel={`${overallMatched}/${total}`}
      />
      <View style={styles.grid}>
        {deck.map((c) => (
          <MatchTile
            key={c.id}
            card={c}
            word={wordsById[c.wordId]}
            state={stateOf(c)}
            onPress={() => onTapCard(c)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
