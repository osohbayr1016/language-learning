import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import type { Stats, Streak } from '../../lib/api/user';

type Props = { stats: Stats; streak: Streak };

export function StatsGrid({ stats, streak }: Props) {
  const items = [
    { label: 'Нийт XP', value: stats?.total_xp ?? 0 },
    { label: 'Сурсан үг', value: stats?.words_learned ?? 0 },
    { label: 'Эзэмшсэн', value: stats?.words_mastered ?? 0 },
    { label: 'Сэргэлт', value: streak?.current_streak ?? 0 },
  ];

  return (
    <View style={styles.grid}>
      {items.map((it) => (
        <Card key={it.label} padding="md" style={styles.cell}>
          <Text style={styles.value}>{it.value}</Text>
          <Text style={styles.label}>{it.label}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  cell: { flexBasis: '48%', flexGrow: 1, alignItems: 'center' },
  value: { ...typography.heading.xl, color: colors.accent.purple },
  label: { ...typography.body.md, color: colors.text.secondary, marginTop: 2 },
});
