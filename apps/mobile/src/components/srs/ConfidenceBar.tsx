import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { ConfidenceLevel } from '../../lib/srs/adaptive';

type Props = {
  value: ConfidenceLevel | null;
  onChange: (v: ConfidenceLevel) => void;
};

const OPTIONS: { value: ConfidenceLevel; label: string; color: string }[] = [
  { value: 0, label: mn.study.confidenceLow, color: colors.error },
  { value: 1, label: mn.study.confidenceMid, color: colors.warning },
  { value: 2, label: mn.study.confidenceHigh, color: colors.success },
];

export function ConfidenceBar({ value, onChange }: Props) {
  return (
    <View>
      <Text style={styles.label}>{mn.study.confidence}</Text>
      <View style={styles.row}>
        {OPTIONS.map((o) => {
          const active = value === o.value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              style={[styles.chip, active && { backgroundColor: o.color, borderColor: o.color }]}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.body.md, color: colors.text.secondary, marginBottom: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  chipLabel: { ...typography.body.md, color: colors.text.secondary, fontWeight: '600' },
  chipLabelActive: { color: colors.text.primary },
});
