import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sheet } from '../../primitives';
import { PronounceButton } from '../../components/audio/PronounceButton';
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
          <Text style={styles.kanji}>{word.kanji}</Text>
          <Text style={styles.romaji}>{word.romaji}</Text>
          <Text style={styles.meaning}>{word.meaning_mn}</Text>
          <PronounceButton wordId={word.id} meaningMn={word.meaning_mn} size="lg" showHints style={styles.btn} />
          {word.example_jp ? (
            <View style={styles.example}>
              <Text style={styles.exampleJp}>{word.example_jp}</Text>
              {word.example_romaji ? <Text style={styles.exampleRomaji}>{word.example_romaji}</Text> : null}
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
  kanji: { ...typography.kanji.lg, color: colors.text.primary, textAlign: 'center' },
  romaji: { ...typography.romaji.lg, color: colors.text.secondary, textAlign: 'center' },
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
  exampleJp: { ...typography.heading.md, color: colors.text.primary, textAlign: 'center' },
  exampleRomaji: { ...typography.romaji.md, color: colors.text.secondary, textAlign: 'center' },
  exampleMn: { ...typography.body.md, color: colors.text.muted, textAlign: 'center' },
});
