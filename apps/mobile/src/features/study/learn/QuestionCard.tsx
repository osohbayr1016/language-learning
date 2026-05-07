import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ToneColoredText, PinyinRow } from '../../../components/hanzi';
import { PronounceButton } from '../../../components/audio/PronounceButton';
import { parseTones } from '../../../lib/tones';
import { Card } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';
import type { WordWithProgress } from '../../../lib/types';

type Props = {
  word: WordWithProgress;
  promptType: 'hanzi-to-mn' | 'mn-to-hanzi';
};

export function QuestionCard({ word, promptType }: Props) {
  const tones = parseTones(word.tones);

  return (
    <Card padding="lg" variant="elevated" style={styles.card}>
      {promptType === 'hanzi-to-mn' ? (
        <View style={styles.center}>
          <ToneColoredText hanzi={word.hanzi} tones={tones} size="lg" />
          <PinyinRow pinyin={word.pinyin} size="md" />
          <PronounceButton wordId={word.id} size="md" style={{ marginTop: spacing.sm }} />
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.label}>Орчуулгыг сонго</Text>
          <Text style={styles.prompt}>{word.meaning_mn}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 200, justifyContent: 'center', marginBottom: spacing.lg },
  center: { alignItems: 'center', gap: spacing.sm },
  label: { ...typography.body.md, color: colors.text.secondary },
  prompt: { ...typography.heading.xl, color: colors.text.primary, textAlign: 'center' },
});
