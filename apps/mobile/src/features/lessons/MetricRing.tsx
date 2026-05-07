import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

type Props = {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color?: string;
  size?: number;
  thickness?: number;
};

export function MetricRing({
  label,
  value,
  icon,
  color = colors.brand.primary,
  size = 84,
  thickness = 8,
}: Props) {
  const pct = Math.max(0, Math.min(1, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <View style={styles.wrap}>
      <View style={[styles.ringBox, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colors.borderLight}
            strokeWidth={thickness}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.iconCenter}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color }]}>{Math.round(pct * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  ringBox: { alignItems: 'center', justifyContent: 'center' },
  iconCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.body.sm, color: colors.text.secondary, marginTop: 4 },
  value: { ...typography.heading.sm },
});
