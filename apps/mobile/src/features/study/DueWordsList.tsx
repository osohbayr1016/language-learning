import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../primitives';
import { WordCard } from '../../components/cards/WordCard';
import { useDueWords } from '../../hooks/useDueWords';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export function DueWordsList({ limit = 5 }: { limit?: number }) {
  const router = useRouter();
  const { words, loading, error } = useDueWords(20);
  const slice = words.slice(0, limit);

  if (loading) {
    return (
      <Card padding="lg" style={styles.empty}>
        <ActivityIndicator color={colors.accent.purple} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding="lg" style={styles.empty}>
        <Text style={styles.muted}>{mn.study.wordsLoadError}</Text>
      </Card>
    );
  }

  if (slice.length === 0) {
    return (
      <Card padding="lg" style={styles.empty}>
        <Text style={styles.muted}>{mn.study.noWords}</Text>
      </Card>
    );
  }

  return (
    <View>
      {slice.map((w) => (
        <WordCard
          key={w.id}
          word={w}
          compact
          onPress={() => router.push('/study/flashcard')}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', paddingVertical: spacing.lg },
  muted: { ...typography.body.md, color: colors.text.secondary, textAlign: 'center' },
});
