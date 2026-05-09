import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { ToneColoredText, PinyinRow } from '../hanzi';
import { PronounceButton } from '../audio/PronounceButton';
import type { Word } from '../../lib/types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  word: Word;
  hanzi: string;
  pinyin: string;
  tones: string | null;
  exampleAside: string | null;
  pronounceStyle?: ViewStyle;
};

export function SpeakWordCardFace({
  word,
  hanzi,
  pinyin,
  tones,
  exampleAside,
  pronounceStyle,
}: Props) {
  return (
    <View style={styles.card}>
      <ToneColoredText hanzi={hanzi} tones={tones ?? undefined} size="md" />
      <PinyinRow pinyin={pinyin} size="md" />
      {exampleAside ? <Text style={styles.exampleHint}>{exampleAside}</Text> : null}
      <Text style={styles.translation}>{word.example_mn ?? word.meaning_mn}</Text>
      <PronounceButton
        wordId={word.id}
        meaningMn={word.meaning_mn}
        wordHanzi={word.hanzi}
        displayText={hanzi}
        size="md"
        style={pronounceStyle ?? styles.pronounce}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  exampleHint: {
    ...typography.body.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  translation: {
    ...typography.body.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  pronounce: { marginTop: spacing.md },
});
