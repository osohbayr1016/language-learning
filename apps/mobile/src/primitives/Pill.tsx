import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  label: string;
  color?: string;
  filled?: boolean;
  size?: 'sm' | 'md';
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
};

export function Pill({
  label,
  color = colors.accent.purple,
  filled = false,
  size = 'sm',
  onPress,
  leftIcon,
  style,
}: Props) {
  const padV = size === 'sm' ? 4 : 8;
  const padH = size === 'sm' ? spacing.sm : spacing.md;

  const composed: ViewStyle = {
    paddingHorizontal: padH,
    paddingVertical: padV,
    borderRadius: radius.full,
    backgroundColor: filled ? color : `${color}22`,
    borderWidth: filled ? 0 : 1,
    borderColor: color,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  };

  const labelStyle = {
    ...typography.body.sm,
    color: filled ? colors.text.primary : color,
    fontWeight: '600' as const,
  };

  const Inner = (
    <View style={composed}>
      {leftIcon ? <View style={{ marginRight: 4 }}>{leftIcon}</View> : null}
      <Text style={labelStyle}>{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed, style]}>
        {Inner}
      </Pressable>
    );
  }

  return <View style={style}>{Inner}</View>;
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
});
