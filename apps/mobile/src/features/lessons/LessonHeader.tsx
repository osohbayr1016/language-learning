import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { ProgressBar } from '../../primitives';

type Props = {
  progress: number;
  onClose: () => void;
  onMore: () => void;
};

export function LessonHeader({ progress, onClose, onMore }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onClose}
        hitSlop={12}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
      >
        <Ionicons name="close" size={26} color={colors.text.secondary} />
      </Pressable>
      <View style={styles.barWrap}>
        <ProgressBar
          value={progress * 100}
          color={colors.brand.primary}
          height={14}
          trackColor={colors.borderLight}
        />
      </View>
      <Pressable
        onPress={onMore}
        hitSlop={12}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
      >
        <Ionicons name="ellipsis-vertical" size={22} color={colors.text.secondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  barWrap: { flex: 1 },
  iconBtn: { padding: spacing.xs },
  pressed: { opacity: 0.6 },
});
