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
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text
            style={[
              styles.title,
              locked
                ? styles.titleLocked
                : {
                    color: '#FFFFFF',
                    textShadowColor: 'rgba(0,0,0,0.25)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[styles.subtitle, locked ? styles.subtitleLocked : { color: 'rgba(255,255,255,0.95)' }]}
          >
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
      {!locked ? (
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  left: { flex: 1 },
  right: { marginLeft: spacing.md },
  barTrack: {
    marginTop: spacing.sm,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  title: {
    ...typography.heading.lg,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  titleLocked: { color: colors.text.muted },
  subtitle: {
    ...typography.body.md,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  subtitleLocked: { color: colors.text.muted },
  percentBox: {
    minWidth: 52,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
  },
  percent: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
  lockBox: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.bg.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
