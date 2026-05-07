import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography } from '../../theme';
import { getToneColor, toneLabel } from '../../lib/tones';

type Props = {
  tone: number | null | undefined;
  width?: number;
  height?: number;
  showLabel?: boolean;
};

function pathForTone(tone: number, w: number, h: number): string {
  const left = 4;
  const right = w - 4;
  const top = 4;
  const mid = h / 2;
  const bottom = h - 4;
  switch (tone) {
    case 1:
      return `M${left},${top + 4} L${right},${top + 4}`;
    case 2:
      return `M${left},${bottom} Q${(left + right) / 2},${mid} ${right},${top + 4}`;
    case 3:
      return `M${left},${mid} Q${(left + right) / 3},${bottom} ${(left + right) / 2},${mid} T${right},${top + 4}`;
    case 4:
      return `M${left},${top + 4} Q${(left + right) / 2},${mid} ${right},${bottom}`;
    default:
      return `M${left},${mid} L${right},${mid}`;
  }
}

export function ToneBar({ tone, width = 64, height = 28, showLabel = false }: Props) {
  const t = tone ?? 0;
  const color = getToneColor(t);

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={height}>
        <Path
          d={pathForTone(t, width, height)}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      {showLabel ? <Text style={[styles.label, { color }]}>{toneLabel(t)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.body.sm, marginTop: spacing.xs, fontWeight: '600' },
});
