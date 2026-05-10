import * as Speech from 'expo-speech';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../../theme';

type Props = {
  hanzi: string;
  accessibilityLabel: string;
};

export function SpeakPhraseButton({ hanzi, accessibilityLabel }: Props) {
  const play = useCallback(() => {
    Speech.stop();
    Speech.speak(hanzi, { language: 'zh-CN', rate: 0.92 });
  }, [hanzi]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={play}
      hitSlop={12}
      style={({ pressed, focused }) => [
        styles.btn,
        pressed && styles.pressed,
        focused && Platform.OS === 'web' ? webFocus : null,
      ]}
    >
      <Text style={styles.icon} importantForAccessibility="no">
        🔊
      </Text>
    </Pressable>
  );
}

const webFocus = {
  outlineStyle: 'solid' as const,
  outlineWidth: 2,
  outlineColor: colors.brand.secondary,
  outlineOffset: 2,
};

const styles = StyleSheet.create({
  btn: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: { opacity: 0.75 },
  icon: { fontSize: 22, lineHeight: 26 },
});
