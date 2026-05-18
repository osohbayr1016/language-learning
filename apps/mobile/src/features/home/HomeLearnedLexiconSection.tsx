import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { useLearnedVocabulary } from '../../hooks/useLearnedVocabulary';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { WordWithProgress } from '../../lib/types';
import { HomeLearnedLexiconList } from './HomeLearnedLexiconList';

function isSingleHanzi(hanzi: string): boolean {
  return Array.from(hanzi).length === 1;
}

function splitLearned(words: WordWithProgress[]): {
  kanjiItems: WordWithProgress[];
  wordItems: WordWithProgress[];
} {
  const kanjiItems: WordWithProgress[] = [];
  const wordItems: WordWithProgress[] = [];
  for (const w of words) {
    if (isSingleHanzi(w.hanzi)) kanjiItems.push(w);
    else wordItems.push(w);
  }
  const cmp = (a: WordWithProgress, b: WordWithProgress) =>
    a.hanzi.localeCompare(b.hanzi, 'zh-CN');
  kanjiItems.sort(cmp);
  wordItems.sort(cmp);
  return { kanjiItems, wordItems };
}

export function HomeLearnedLexiconSection() {
  const { token } = useAuth();
  const learned = useLearnedVocabulary(!!token);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      void learned.refresh();
    }, [token, learned.refresh])
  );

  const { kanjiItems, wordItems } = useMemo(
    () => splitLearned(learned.words),
    [learned.words]
  );

  if (!token) {
    return (
      <Card padding="lg" variant="elevated" style={styles.card}>
        <Text style={styles.title}>{mn.home.dueToday}</Text>
        <Text style={styles.sub}>{mn.home.learnedLexiconLogin}</Text>
      </Card>
    );
  }

  return (
    <Card padding="lg" variant="elevated" style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>{mn.home.dueToday}</Text>
        {learned.total > 0 ? (
          <Text style={styles.sub}>
            {mn.home.dueWordsCount.replace('{n}', String(learned.total))}
          </Text>
        ) : !learned.loading ? (
          <Text style={styles.sub}>{mn.home.noDue}</Text>
        ) : null}
      </View>
      <HomeLearnedLexiconList
        loading={learned.loading && learned.words.length === 0}
        error={learned.error}
        kanjiItems={kanjiItems}
        wordItems={wordItems}
        hasMore={learned.hasMore}
        loadingMore={learned.loadingMore}
        onLoadMore={learned.loadMore}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  head: { marginBottom: spacing.md },
  title: { ...typography.heading.md, color: colors.text.primary },
  sub: { ...typography.body.md, color: colors.text.secondary, marginTop: 4 },
});
