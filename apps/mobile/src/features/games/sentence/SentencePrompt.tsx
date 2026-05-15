import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';
import type { Word } from '../../../lib/types';

const BLANK = '＿＿';

type Props = {
  word: Word;
  filled?: string | null;
};

export function SentencePrompt({ word, filled }: Props) {
  const example = word.example_jp ?? '';
  const masked = example.includes(word.kanji)
    ? example.replace(word.kanji, BLANK)
    : `${BLANK} ${example}`.trim();
  const display = filled ? masked.replace(BLANK, filled) : masked;

  return (
    <Card padding="lg" variant="elevated" style={styles.card}>
      <Text style={styles.label}>Дутуу үгийг нөх</Text>
      <Text style={styles.jp}>{display}</Text>
      {word.example_romaji ? <Text style={styles.romaji}>{word.example_romaji}</Text> : null}
      {word.example_mn ? <Text style={styles.mn}>{word.example_mn}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md, gap: spacing.xs, alignItems: 'center' },
  label: { ...typography.body.md, color: colors.text.secondary },
  jp: {
    ...typography.heading.lg,
    color: colors.text.primary,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  romaji: { ...typography.romaji.md, color: colors.text.secondary, textAlign: 'center' },
  mn: { ...typography.body.md, color: colors.text.muted, textAlign: 'center', marginTop: 4 },
});
