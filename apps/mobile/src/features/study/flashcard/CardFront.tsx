import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ToneColoredText, ToneBar } from '../../../components/hanzi';
import { PronounceButton } from '../../../components/audio/PronounceButton';
import { parseTones } from '../../../lib/tones';
import { colors, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';
import type { WordWithProgress } from '../../../lib/types';

type Props = { word: WordWithProgress };

export function CardFront({ word }: Props) {
  const tones = parseTones(word.tones);
  const firstTone = tones[0] ?? 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>{mn.study.showAnswer}</Text>
      <ToneColoredText hanzi={word.hanzi} tones={tones} size="xl" />
      <View style={styles.toneRow}>
        <ToneBar tone={firstTone} width={80} height={32} />
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <PronounceButton wordId={word.id} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  hint: { ...typography.body.sm, color: colors.text.muted, position: 'absolute', top: spacing.md },
  toneRow: { marginTop: spacing.sm },
});
