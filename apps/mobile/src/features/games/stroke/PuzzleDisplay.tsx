import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../primitives';
import { colors, radius, spacing, typography } from '../../../theme';
import type { StrokePuzzle } from './puzzles';

type Props = { puzzle: StrokePuzzle; filled?: string | null };

export function PuzzleDisplay({ puzzle, filled }: Props) {
  return (
    <Card padding="lg" variant="elevated" style={styles.card}>
      <Text style={styles.label}>{puzzle.meaning_mn}</Text>
      <Text style={styles.pinyin}>{puzzle.pinyin}</Text>
      <View style={styles.expr}>
        <Box content={filled ?? '?'} highlighted={!filled} />
        <Text style={styles.plus}>+</Text>
        <Box content={puzzle.givenPart} />
        <Text style={styles.equals}>=</Text>
        <Box content={filled ? puzzle.hanzi : '?'} bigger highlighted />
      </View>
    </Card>
  );
}

function Box({ content, bigger, highlighted }: { content: string; bigger?: boolean; highlighted?: boolean }) {
  return (
    <View
      style={[
        styles.box,
        bigger && styles.boxBig,
        highlighted && { borderColor: colors.accent.purple, backgroundColor: 'rgba(124, 58, 237, 0.1)' },
      ]}
    >
      <Text style={[styles.boxText, bigger && styles.boxTextBig]}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  label: { ...typography.heading.lg, color: colors.text.primary },
  pinyin: { ...typography.pinyin.md, color: colors.accent.purple },
  expr: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  box: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxBig: { width: 80, height: 80 },
  boxText: { ...typography.heading.lg, color: colors.text.primary },
  boxTextBig: { fontSize: 40, fontWeight: '300' },
  plus: { ...typography.heading.lg, color: colors.text.muted },
  equals: { ...typography.heading.lg, color: colors.text.muted },
});
