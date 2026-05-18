import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { HskLevel } from '../../lib/types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  levels: HskLevel[];
  selected: HskLevel | null;
  onSelect: (level: HskLevel) => void;
};

export function HskLevelPicker({ levels, selected, onSelect }: Props) {
  if (levels.length <= 1) return null;

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {levels.map((lv) => {
          const active = selected === lv;
          return (
            <Pressable
              key={lv}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(lv)}
              style={({ pressed }) => [
                styles.pill,
                active ? styles.pillOn : styles.pillOff,
                pressed && styles.pillPressed,
              ]}
            >
              <Text style={[styles.label, active && styles.labelOn]}>{`HSK ${lv}`}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm, paddingVertical: 2 },
  pill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 2,
  },
  pillOn: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primaryShadow,
  },
  pillOff: {
    backgroundColor: colors.bg.secondary,
    borderColor: colors.border,
  },
  pillPressed: { opacity: 0.9 },
  label: { ...typography.heading.sm, color: colors.text.secondary },
  labelOn: { color: colors.text.inverse },
});
