import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ToneColoredText } from '../../../components/hanzi';
import { colors, radius, spacing, typography } from '../../../theme';
import type { WordWithProgress } from '../../../lib/types';

type State = 'idle' | 'correct' | 'wrong' | 'reveal';

type Props = {
  word: WordWithProgress;
  show: 'jp' | 'mn';
  state: State;
  onPress: () => void;
};

export function AnswerOption({ word, show, state, onPress }: Props) {
  const stateStyles: Record<State, object> = {
    idle: styles.idle,
    correct: styles.correct,
    wrong: styles.wrong,
    reveal: styles.reveal,
  };

  const label = show === 'jp' ? word.kanji : word.meaning_mn;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={state !== 'idle'}
      style={[styles.btn, stateStyles[state]]}
    >
      {show === 'jp' ? (
        <View style={styles.row}>
          <ToneColoredText hanzi={word.kanji} size="sm" align="left" />
        </View>
      ) : (
        <Text style={styles.text}>{word.meaning_mn}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  idle: { backgroundColor: colors.bg.card, borderColor: colors.border },
  correct: { backgroundColor: 'rgba(16, 185, 129, 0.16)', borderColor: colors.success },
  wrong: { backgroundColor: 'rgba(239, 68, 68, 0.16)', borderColor: colors.error },
  reveal: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: colors.success },
  text: { ...typography.heading.sm, color: colors.text.primary },
});
