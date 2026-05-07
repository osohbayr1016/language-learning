import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../../theme';

type Props = {
  current: number;
  goal: number;
  size?: number;
  thickness?: number;
};

export function DailyGoalRing({ current, goal, size = 96, thickness = 10 }: Props) {
  const pct = Math.min(1, current / Math.max(1, goal));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.bg.elevated}
          strokeWidth={thickness}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={pct >= 1 ? colors.success : colors.accent.purple}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.value}>{Math.round(pct * 100)}%</Text>
        <Text style={styles.unit}>{current}/{goal}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  value: { ...typography.heading.md, color: colors.text.primary },
  unit: { ...typography.body.sm, color: colors.text.secondary },
});
