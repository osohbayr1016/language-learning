import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from '../../primitives';
import { ToneColoredText } from '../../components/hanzi';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { WordWithProgress } from '../../lib/types';

type Props = {
  loading: boolean;
  error: string | null;
  kanjiItems: WordWithProgress[];
  wordItems: WordWithProgress[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

function KanjiCell({ word }: { word: WordWithProgress }) {
  return (
    <View style={styles.kCell}>
      <ToneColoredText hanzi={word.hanzi} tones={word.tones} size="sm" align="center" />
      <Text style={styles.kPinyin} numberOfLines={1}>
        {word.pinyin}
      </Text>
    </View>
  );
}

function WordLine({ word }: { word: WordWithProgress }) {
  return (
    <View style={styles.wRow}>
      <ToneColoredText hanzi={word.hanzi} tones={word.tones} size="sm" align="left" />
      <Text style={styles.wPinyin} numberOfLines={1}>
        {word.pinyin}
      </Text>
      <Text style={styles.wMean} numberOfLines={2}>
        {word.meaning_mn}
      </Text>
    </View>
  );
}

export function HomeLearnedLexiconList({
  loading,
  error,
  kanjiItems,
  wordItems,
  hasMore,
  loadingMore,
  onLoadMore,
}: Props) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent.purple} />
      </View>
    );
  }
  if (error) {
    return <Text style={styles.muted}>{mn.study.wordsLoadError}</Text>;
  }
  if (kanjiItems.length === 0 && wordItems.length === 0) {
    return <Text style={styles.muted}>{mn.study.learnedWordsEmpty}</Text>;
  }

  return (
    <View>
      {kanjiItems.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.subhead}>{mn.home.learnedLexiconKanji}</Text>
          <View style={styles.kGrid}>
            {kanjiItems.map((w) => (
              <KanjiCell key={w.id} word={w} />
            ))}
          </View>
        </View>
      ) : null}
      {wordItems.length > 0 ? (
        <View style={styles.block}>
          <Text style={styles.subhead}>{mn.home.learnedLexiconWords}</Text>
          {wordItems.map((w) => (
            <WordLine key={w.id} word={w} />
          ))}
        </View>
      ) : null}
      {hasMore ? (
        <Button
          label={mn.study.learnedWordsLoadMore}
          variant="secondary"
          loading={loadingMore}
          onPress={() => void onLoadMore()}
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.md, alignItems: 'center' },
  muted: { ...typography.body.md, color: colors.text.secondary },
  block: { marginBottom: spacing.md },
  subhead: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  kGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  kCell: {
    width: 72,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
  },
  kPinyin: { ...typography.body.sm, color: colors.text.muted, marginTop: 4, fontSize: 10 },
  wRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg.card,
  },
  wPinyin: { ...typography.body.sm, color: colors.text.secondary, marginTop: 4 },
  wMean: { ...typography.body.md, color: colors.text.muted, marginTop: 4 },
});
