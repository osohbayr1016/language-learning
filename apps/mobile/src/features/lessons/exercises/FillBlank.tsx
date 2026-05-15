import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';
import type { Exercise } from '../types';
import { OptionTile } from './OptionTile';

type Props = {
  exercise: Extract<Exercise, { kind: 'fill-blank' }>;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

export function FillBlank({ exercise, disabled, onAnswer }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const target = exercise.word;
  const sentence = target.example_jp ?? `${target.kanji}`;
  const masked = sentence.replace(target.kanji, '____');

  const onPick = (id: number) => {
    if (picked !== null || disabled) return;
    setPicked(id);
    onAnswer(id === target.id);
  };

  return (
    <View style={styles.root}>
      <View style={styles.sentenceBox}>
        <Text style={styles.sentence}>{masked}</Text>
        {target.example_mn ? (
          <Text style={styles.translation}>{target.example_mn}</Text>
        ) : null}
      </View>
      <View style={styles.list}>
        {exercise.options.map((opt) => {
          let state: 'idle' | 'selected' | 'correct' | 'wrong' = 'idle';
          if (picked !== null) {
            if (opt.id === target.id) state = 'correct';
            else if (opt.id === picked) state = 'wrong';
          }
          return (
            <OptionTile
              key={opt.id}
              label={opt.kanji}
              sub={opt.romaji ?? undefined}
              state={state}
              disabled={picked !== null || disabled}
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
  sentenceBox: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sentence: { ...typography.heading.lg, color: colors.text.primary },
  translation: { ...typography.body.md, color: colors.text.secondary, marginTop: spacing.xs },
  list: { gap: spacing.sm },
});
