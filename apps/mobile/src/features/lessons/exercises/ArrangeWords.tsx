import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../primitives';
import { colors, radius, spacing, typography } from '../../../theme';
import type { Exercise } from '../types';

type Props = {
  exercise: Extract<Exercise, { kind: 'arrange-words' }>;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

function splitChars(text: string): string[] {
  return Array.from(text.replace(/\s+/g, ''));
}

export function ArrangeWords({ exercise, disabled, onAnswer }: Props) {
  const target = useMemo(
    () => splitChars(exercise.word.example_jp ?? exercise.word.kanji),
    [exercise]
  );
  const tray = useMemo(() => [...target].sort(() => Math.random() - 0.5), [target]);
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const remaining = tray
    .map((ch, i) => ({ ch, i }))
    .filter(({ i }) => !picked.includes(i));

  const placedText = picked.map((i) => tray[i]).join('');
  const targetText = target.join('');

  const onPickFromTray = (i: number) => {
    if (submitted || disabled) return;
    setPicked((p) => [...p, i]);
  };

  const onPopPlaced = (idx: number) => {
    if (submitted || disabled) return;
    setPicked((p) => p.filter((_, j) => j !== idx));
  };

  const onCheck = () => {
    setSubmitted(true);
    onAnswer(placedText === targetText);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.prompt}>"{exercise.word.example_mn}"</Text>

      <View style={styles.lineWrap}>
        <View style={styles.line} />
        <View style={styles.placedRow}>
          {picked.map((i, idx) => (
            <Pressable key={`p-${idx}`} onPress={() => onPopPlaced(idx)} disabled={submitted}>
              <View style={styles.token}>
                <Text style={styles.tokenText}>{tray[i]}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.tray}>
        {remaining.map(({ ch, i }) => (
          <Pressable key={`t-${i}`} onPress={() => onPickFromTray(i)} disabled={submitted}>
            <View style={styles.token}>
              <Text style={styles.tokenText}>{ch}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Button
        label="Шалгах"
        onPress={onCheck}
        disabled={submitted || picked.length === 0 || disabled}
        style={{ marginTop: spacing.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  prompt: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.md },
  lineWrap: { minHeight: 80, justifyContent: 'center', marginVertical: spacing.md },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 6,
    height: 2,
    backgroundColor: colors.brand.primary,
    opacity: 0.4,
  },
  placedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    minHeight: 96,
    paddingTop: spacing.md,
  },
  token: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.card,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  tokenText: { fontSize: 22, fontWeight: '700', color: colors.text.primary },
});
