import * as Speech from 'expo-speech';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../../theme';

type Props = {
  /** Japanese text to speak (prefer kana/kanji as shown on the slide). */
  phrase: string;
  accessibilityLabel: string;
};

export function SpeakPhraseButton({ phrase, accessibilityLabel }: Props) {
  const play = useCallback(() => {
    Speech.stop();
    Speech.speak(phrase, { language: 'ja-JP', rate: 0.92 });
  }, [phrase]);

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
