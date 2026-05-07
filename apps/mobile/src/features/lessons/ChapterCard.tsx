import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = {
  title: string;
  subtitle: string;
  color: string;
  completed: number;
  total: number;
  locked?: boolean;
};

export function ChapterCard({ title, subtitle, color, completed, total, locked }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={[styles.card, { backgroundColor: locked ? colors.bg.secondary : color }]}>
      <View style={styles.left}>
        <Text style={[styles.title, { color: locked ? colors.text.muted : '#FFFFFF' }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: locked ? colors.text.muted : 'rgba(255,255,255,0.92)' }]}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.right}>
        {locked ? (
          <View style={styles.lockBox}>
            <Ionicons name="lock-closed" size={22} color={colors.text.muted} />
          </View>
        ) : (
          <View style={styles.percentBox}>
            <Text style={styles.percent}>{pct}%</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  left: { flex: 1 },
  right: { marginLeft: spacing.md },
  title: { ...typography.heading.md },
  subtitle: { ...typography.body.sm, marginTop: 2 },
  percentBox: {
    minWidth: 52,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
  },
  percent: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  lockBox: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.bg.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
