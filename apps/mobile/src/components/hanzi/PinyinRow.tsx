import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { typography, colors } from '../../theme';

type Size = keyof typeof typography.pinyin;

type Props = {
  pinyin: string;
  size?: Size;
  style?: TextStyle;
  align?: 'left' | 'center' | 'right';
};

export function PinyinRow({ pinyin, size = 'md', style, align = 'center' }: Props) {
  return (
    <View style={[styles.wrap, { justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }]}>
      <Text style={[typography.pinyin[size], { color: colors.text.secondary }, style]}>
        {pinyin}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center' },
});
