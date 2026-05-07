import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sheet } from '../../primitives';
import { ToneColoredText, PinyinRow } from '../../components/hanzi';
import { PronounceButton } from '../../components/audio/PronounceButton';
import { parseTones } from '../../lib/tones';
import { colors, spacing, typography } from '../../theme';
import type { CartoonWord } from '../../lib/api/cartoons';

type Props = {
  word: CartoonWord | null;
  onClose: () => void;
};

export function VocabSheet({ word, onClose }: Props) {
  return (
    <Sheet visible={!!word} onClose={onClose}>
      {word ? (
        <View style={styles.body}>
          <ToneColoredText hanzi={word.hanzi} tones={parseTones(word.tones)} size="lg" />
          <PinyinRow pinyin={word.pinyin} size="lg" />
          <Text style={styles.meaning}>{word.meaning_mn}</Text>
          <PronounceButton wordId={word.id} size="lg" showHints style={styles.btn} />
          {word.example_zh ? (
            <View style={styles.example}>
              <Text style={styles.exampleZh}>{word.example_zh}</Text>
              {word.example_pinyin ? <Text style={styles.examplePinyin}>{word.example_pinyin}</Text> : null}
              {word.example_mn ? <Text style={styles.exampleMn}>{word.example_mn}</Text> : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  meaning: { ...typography.heading.lg, color: colors.text.primary, textAlign: 'center', marginVertical: spacing.sm },
  btn: { marginTop: spacing.sm },
  example: {
    backgroundColor: colors.bg.elevated,
    padding: spacing.md,
    borderRadius: 12,
    width: '100%',
    marginTop: spacing.md,
    gap: 4,
  },
  exampleZh: { ...typography.heading.md, color: colors.text.primary, textAlign: 'center' },
  examplePinyin: { ...typography.pinyin.md, color: colors.text.secondary, textAlign: 'center' },
  exampleMn: { ...typography.body.md, color: colors.text.muted, textAlign: 'center' },
});
