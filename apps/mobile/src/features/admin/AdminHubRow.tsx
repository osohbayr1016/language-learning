import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import type { HubRowDef } from './adminHubSections';

type Props = { item: HubRowDef; onPress: () => void; showDivider: boolean };

export function AdminHubRow({ item, onPress, showDivider }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.rowDivider,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: `${item.tint}18` }]}>
        <Ionicons name={item.icon} size={22} color={item.tint} />
      </View>
      <View style={styles.rowMain}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowHint}>{item.hint}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowPressed: { backgroundColor: colors.bg.elevated },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { flex: 1, minWidth: 0 },
  rowLabel: { ...typography.heading.sm, color: colors.text.primary },
  rowHint: {
    ...typography.body.sm,
    color: colors.text.muted,
    marginTop: 2,
    lineHeight: 18,
  },
});
