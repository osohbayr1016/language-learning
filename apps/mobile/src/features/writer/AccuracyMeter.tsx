import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  mistakes: number;
  strokes: number;
};

export function AccuracyMeter({ mistakes, strokes }: Props) {
  const score = Math.max(0, Math.round(100 - (mistakes / Math.max(1, strokes)) * 30));
  const color = score >= 90 ? colors.success : score >= 70 ? colors.warning : colors.error;
  const label = score >= 90 ? 'Гайхалтай' : score >= 70 ? 'Сайн' : 'Дахин оролд';

  return (
    <View style={styles.wrap}>
      <View style={[styles.score, { borderColor: color }]}>
        <Text style={[styles.scoreText, { color }]}>{score}</Text>
        <Text style={styles.scoreLabel}>оноо</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color }]}>{label}</Text>
        <Text style={styles.meta}>Алдаа: {mistakes} · Зураас: {strokes}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  score: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: { ...typography.heading.xl },
  scoreLabel: { ...typography.body.sm, color: colors.text.muted },
  title: { ...typography.heading.lg },
  meta: { ...typography.body.md, color: colors.text.secondary, marginTop: 2 },
});
