import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { ReviewRating } from '@japanese-learning/srs';

type Props = {
  onRate: (rating: ReviewRating) => void;
  disabled?: boolean;
};

const OPTIONS: { rating: ReviewRating; label: string; color: string }[] = [
  { rating: 1, label: mn.study.again, color: colors.error },
  { rating: 3, label: mn.study.hard, color: colors.warning },
  { rating: 4, label: mn.study.good, color: colors.success },
  { rating: 5, label: mn.study.easy, color: colors.accent.teal },
];

export function RatingBar({ onRate, disabled }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((o) => (
        <Pressable
          key={o.rating}
          disabled={disabled}
          onPress={() => onRate(o.rating)}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: o.color },
            pressed && styles.pressed,
            disabled && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.label}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  label: { ...typography.heading.sm, color: colors.text.primary },
});
