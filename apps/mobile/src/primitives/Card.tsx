import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: keyof typeof spacing | 0;
  glow?: string;
};

export function Card({ children, onPress, style, variant = 'default', padding = 'md', glow }: Props) {
  const padValue = typeof padding === 'number' ? padding : spacing[padding];

  const variants: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.bg.card,
      borderWidth: 2,
      borderColor: colors.border,
    },
    elevated: {
      backgroundColor: colors.bg.elevated,
      borderWidth: 2,
      borderColor: colors.border,
      ...shadows.sm,
    },
    outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.border },
  };

  const composed: ViewStyle = {
    borderRadius: radius.lg,
    padding: padValue,
    ...variants[variant],
    ...(glow ? shadows.glow(glow) : {}),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [composed, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[composed, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
