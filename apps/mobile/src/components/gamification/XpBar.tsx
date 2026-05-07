import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '../../primitives';
import { colors, spacing, typography } from '../../theme';

type Props = {
  xp: number;
  goal: number;
  label?: string;
};

export function XpBar({ xp, goal, label = 'XP' }: Props) {
  const pct = Math.min(100, Math.round((xp / Math.max(1, goal)) * 100));
  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>{xp} / {goal}</Text>
      </View>
      <ProgressBar value={pct} color={colors.accent.purple} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: spacing.xs },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...typography.heading.sm, color: colors.text.primary },
  values: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '600' },
});
