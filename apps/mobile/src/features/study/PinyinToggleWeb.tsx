import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useDisplayPrefs } from '../../context/DisplayPrefsContext';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';

/** Вэб дээр л: pinyin харуулах/нуух. */
export function PinyinToggleWeb() {
  const { showPinyin, toggleShowPinyin } = useDisplayPrefs();
  if (Platform.OS !== 'web') return null;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => void toggleShowPinyin()}
      style={({ pressed }) => [styles.chip, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.tx}>{showPinyin ? mn.study.pinyinOn : mn.study.pinyinOff}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tx: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '600' },
});
