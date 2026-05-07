import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { typography } from '../../theme';
import { getToneColor, parseTones } from '../../lib/tones';
import type { Tone } from '../../lib/types';

type Size = keyof typeof typography.hanzi;

type Props = {
  hanzi: string;
  tones?: string | Tone[] | null;
  size?: Size;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
};

function resolveTones(input: Props['tones']): number[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return parseTones(input);
}

export function ToneColoredText({ hanzi, tones, size = 'md', align = 'center', style }: Props) {
  const toneList = resolveTones(tones);
  const chars = Array.from(hanzi);

  return (
    <View style={[styles.row, { justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }]}>
      {chars.map((c, i) => (
        <Text
          key={`${c}-${i}`}
          style={[typography.hanzi[size], { color: getToneColor(toneList[i] ?? 0) }, style]}
        >
          {c}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
});
