import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PronounceButton } from '../../../components/audio/PronounceButton';
import { spacing } from '../../../theme';
import type { Exercise } from '../types';
import { OptionTile } from './OptionTile';

type Props = {
  exercise: Extract<Exercise, { kind: 'listen-mcq' }>;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

export function ListenMcq({ exercise, disabled, onAnswer }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const onPick = (id: number) => {
    if (selectedId !== null || disabled) return;
    setSelectedId(id);
    onAnswer(id === exercise.word.id);
  };

  return (
    <View style={styles.root}>
      <View style={styles.audio}>
        <PronounceButton wordId={exercise.word.id} meaningMn={exercise.word.meaning_mn} size="lg" showHints />
      </View>
      <View style={styles.list}>
        {exercise.options.map((opt) => {
          let state: 'idle' | 'selected' | 'correct' | 'wrong' = 'idle';
          if (selectedId !== null) {
            if (opt.id === exercise.word.id) state = 'correct';
            else if (opt.id === selectedId) state = 'wrong';
          }
          return (
            <OptionTile
              key={opt.id}
              label={opt.kanji}
              sub={opt.meaning_mn}
              state={state}
              disabled={selectedId !== null || disabled}
              onPress={() => onPick(opt.id)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  audio: { width: '100%', alignItems: 'center', marginVertical: spacing.lg },
  list: { gap: spacing.sm },
});
