import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../primitives';
import { PronounceButton } from '../../../components/audio/PronounceButton';
import { colors, spacing, typography } from '../../../theme';
import type { WordWithProgress } from '../../../lib/types';

type Props = { word: WordWithProgress };

export function PromptCard({ word }: Props) {
  return (
    <Card padding="lg" variant="elevated" style={styles.card}>
      <Text style={styles.label}>Утга</Text>
      <Text style={styles.meaning}>{word.meaning_mn}</Text>
      <PronounceButton wordId={word.id} size="lg" style={styles.pronBtn} />
      <Text style={styles.hint}>Pinyin эсвэл ханз бичээрэй</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', minHeight: 220, justifyContent: 'center', gap: spacing.md, marginBottom: spacing.lg },
  label: { ...typography.body.md, color: colors.text.secondary },
  meaning: { ...typography.heading.xl, color: colors.text.primary, textAlign: 'center' },
  pronBtn: { marginTop: spacing.sm },
  hint: { ...typography.body.sm, color: colors.text.muted, marginTop: spacing.sm },
});
