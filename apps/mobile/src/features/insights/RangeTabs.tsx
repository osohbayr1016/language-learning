import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export type RangeKey = 'weekly' | 'monthly' | 'yearly';

type Props = {
  active: RangeKey;
  enabled?: RangeKey[];
};

const ORDER: RangeKey[] = ['weekly', 'monthly', 'yearly'];

export function RangeTabs({ active, enabled = ['weekly', 'monthly', 'yearly'] }: Props) {
  return (
    <View style={styles.row}>
      {ORDER.map((k) => {
        const isActive = k === active;
        const isEnabled = enabled.includes(k);
        return (
          <Pressable
            key={k}
            disabled={!isEnabled}
            style={[
              styles.tab,
              isActive && styles.tabActive,
              !isEnabled && styles.tabDisabled,
            ]}
          >
            <Text style={[
              styles.label,
              isActive && styles.labelActive,
              !isEnabled && styles.labelDisabled,
            ]}>
              {mn.insights.range[k]}
            </Text>
            {!isEnabled && (
              <Text style={styles.soon}>{mn.insights.range.soon}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  tab: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.bg.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabActive: { backgroundColor: colors.brand.primary },
  tabDisabled: { opacity: 0.55 },
  label: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '700' },
  labelActive: { color: colors.text.inverse },
  labelDisabled: { color: colors.text.muted },
  soon: { ...typography.body.sm, color: colors.text.muted, fontSize: 10 },
});
