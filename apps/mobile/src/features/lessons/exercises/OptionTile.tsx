import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';

type State = 'idle' | 'selected' | 'correct' | 'wrong';

type Props = {
  label: string;
  sub?: string;
  state: State;
  onPress: () => void;
  disabled?: boolean;
};

const COLORS: Record<State, { bg: string; border: string; text: string }> = {
  idle: { bg: colors.bg.card, border: colors.border, text: colors.text.primary },
  selected: { bg: '#DDF4FF', border: colors.brand.secondary, text: colors.brand.secondary },
  correct: { bg: '#D7FFB8', border: colors.success, text: colors.success },
  wrong: { bg: '#FFDFE0', border: colors.error, text: colors.error },
};

export function OptionTile({ label, sub, state, onPress, disabled }: Props) {
  const c = COLORS[state];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: c.bg, borderColor: c.border },
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: c.text }]} numberOfLines={2}>
        {label}
      </Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    minHeight: 64,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.98 }] },
  label: { ...typography.heading.md },
  sub: { ...typography.body.sm, color: colors.text.muted, marginTop: 2 },
});
