import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../../theme';
import type { Exercise } from '../types';
import { OptionTile } from './OptionTile';

type Props = {
  exercise: Extract<Exercise, { kind: 'choose-word' }>;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

export function ChooseWordMcq({ exercise, disabled, onAnswer }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const onPick = (id: number) => {
    if (selectedId !== null || disabled) return;
    setSelectedId(id);
    onAnswer(id === exercise.word.id);
  };

  return (
    <View style={styles.root}>
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
              label={opt.hanzi}
              sub={opt.pinyin}
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
  root: { flex: 1, justifyContent: 'center' },
  list: { gap: spacing.sm },
});
