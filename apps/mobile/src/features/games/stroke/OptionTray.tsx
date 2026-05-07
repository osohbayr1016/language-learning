import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';

type State = 'idle' | 'correct' | 'wrong';

type Props = {
  options: string[];
  selected: string | null;
  state: State;
  correct: string;
  onPick: (opt: string) => void;
};

export function OptionTray({ options, selected, state, correct, onPick }: Props) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const isSel = selected === opt;
        const isCorrectMark = state !== 'idle' && opt === correct;
        const stateStyle = isCorrectMark
          ? styles.correct
          : isSel && state === 'wrong'
            ? styles.wrong
            : styles.idle;
        return (
          <Pressable
            key={opt}
            onPress={() => onPick(opt)}
            disabled={state !== 'idle'}
            style={[styles.tile, stateStyle]}
          >
            <Text style={styles.text}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  tile: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: { backgroundColor: colors.bg.card, borderColor: colors.border },
  correct: { backgroundColor: 'rgba(16, 185, 129, 0.16)', borderColor: colors.success },
  wrong: { backgroundColor: 'rgba(239, 68, 68, 0.16)', borderColor: colors.error },
  text: { fontSize: 32, color: colors.text.primary, fontWeight: '300' },
});
