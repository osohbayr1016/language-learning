import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
}: Props) {
  const heights: Record<Size, number> = { sm: 40, md: 50, lg: 58 };
  const padH: Record<Size, number> = { sm: spacing.md, md: spacing.lg, lg: spacing.lg };

  const base: ViewStyle = {
    height: heights[size],
    borderRadius: radius.full,
    paddingHorizontal: padH[size],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled || loading ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  const variants: Record<Variant, ViewStyle> = {
    primary: {
      backgroundColor: colors.brand.primary,
      borderBottomWidth: 4,
      borderBottomColor: colors.brand.primaryShadow,
    },
    secondary: { backgroundColor: colors.bg.secondary, borderWidth: 2, borderColor: colors.border },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: colors.error, borderBottomWidth: 4, borderBottomColor: '#CC3838' },
  };

  const textStyles: Record<Variant, TextStyle> = {
    primary: { color: colors.text.inverse, textTransform: 'uppercase', letterSpacing: 1 },
    secondary: { color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1 },
    ghost: { color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1 },
    danger: { color: colors.text.inverse, textTransform: 'uppercase', letterSpacing: 1 },
  };

  return (
    <Pressable
      style={({ pressed }) => [base, variants[variant], pressed && !disabled && styles.pressed, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.text.inverse : colors.brand.primary} />
      ) : (
        <View style={styles.row}>
          {leftIcon ? <View style={{ marginRight: spacing.sm }}>{leftIcon}</View> : null}
          <Text style={[typography.heading.sm, textStyles[variant]]}>{label}</Text>
          {rightIcon ? <View style={{ marginLeft: spacing.sm }}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.97 }] },
});
