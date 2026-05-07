import React from 'react';
import { Text, TextStyle } from 'react-native';
import { typography } from '../../theme';
import { getToneColor } from '../../lib/tones';

type Size = keyof typeof typography.hanzi;

type Props = {
  char: string;
  tone?: number | null;
  size?: Size;
  color?: string;
  style?: TextStyle;
};

export function HanziChar({ char, tone, size = 'md', color, style }: Props) {
  const finalColor = color ?? getToneColor(tone ?? 0);
  return <Text style={[typography.hanzi[size], { color: finalColor }, style]}>{char}</Text>;
}
