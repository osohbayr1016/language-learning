import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { GamesStats } from './useGamesStats';

type CellProps = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
};

function Cell({ label, value, icon, color }: CellProps) {
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

type Props = { data: GamesStats };

export function GamesStatsStrip({ data }: Props) {
  const best = Math.max(0, ...Object.values(data.bestByType));
  const acc = data.total > 0 ? Math.round(data.avgAccuracy * 100) : 0;
  return (
    <View style={styles.row}>
      <Cell
        label={mn.games.totalGames}
        value={String(data.total)}
        icon="game-controller"
        color={colors.brand.primary}
      />
      <Cell
        label={mn.games.bestScore}
        value={String(best)}
        icon="trophy"
        color={colors.warning}
      />
      <Cell
        label={mn.games.avgAccuracy}
        value={`${acc}%`}
        icon="analytics"
        color={colors.info}
      />
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
