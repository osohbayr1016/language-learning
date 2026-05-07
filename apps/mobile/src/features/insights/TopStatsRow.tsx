import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  longest: number;
  current: number;
  days: number;
};

type CellProps = { value: number; label: string; icon: keyof typeof Ionicons.glyphMap; color: string };

function Cell({ value, label, icon, color }: CellProps) {
  return (
    <View style={styles.cell}>
      <View style={[styles.icon, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </View>
  );
}

export function TopStatsRow({ longest, current, days }: Props) {
  return (
    <View style={styles.row}>
      <Cell value={longest} label={mn.insights.topStats.longest} icon="flame" color={colors.warning} />
      <Cell value={current} label={mn.insights.topStats.current} icon="flash" color={colors.brand.primary} />
      <Cell value={days} label={mn.insights.topStats.days} icon="calendar" color={colors.info} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  cell: {
    flex: 1,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  icon: {
    width: 36, height: 36, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: { ...typography.heading.lg, color: colors.text.primary },
  label: { ...typography.body.sm, color: colors.text.secondary, textAlign: 'center', marginTop: 2 },
});
