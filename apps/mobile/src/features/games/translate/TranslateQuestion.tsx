import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../primitives';
import { ToneColoredText, PinyinRow } from '../../../components/hanzi';
import { PronounceButton } from '../../../components/audio/PronounceButton';
import { parseTones } from '../../../lib/tones';
import { colors, spacing, typography } from '../../../theme';
import type { Word } from '../../../lib/types';

type Props = {
  word: Word;
  direction: 'zh-to-mn' | 'mn-to-zh';
};

export function TranslateQuestion({ word, direction }: Props) {
  const tones = parseTones(word.tones);

  return (
    <Card padding="lg" variant="elevated" style={styles.card}>
      {direction === 'zh-to-mn' ? (
        <View style={styles.center}>
          <ToneColoredText hanzi={word.hanzi} tones={tones} size="lg" />
          <PinyinRow pinyin={word.pinyin} size="md" />
          <PronounceButton wordId={word.id} meaningMn={word.meaning_mn} size="md" style={{ marginTop: spacing.sm }} />
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.label}>Орчуул</Text>
          <Text style={styles.prompt}>{word.meaning_mn}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 180, justifyContent: 'center', marginBottom: spacing.md },
  center: { alignItems: 'center', gap: spacing.xs },
  label: { ...typography.body.md, color: colors.text.secondary },
  prompt: { ...typography.heading.xl, color: colors.text.primary, textAlign: 'center' },
});
