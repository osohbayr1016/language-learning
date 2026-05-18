import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { ProgressBar } from '../../primitives';
import { mn } from '../../i18n/mn';

type Props = {
  progress: number;
  onClose: () => void;
  onMore: () => void;
  onAdminEdit?: () => void;
  /** Admin preview: show back arrow instead of close (X) */
  leadingIcon?: 'close' | 'back';
  /** When false, hides the ellipsis menu (practice / kiosk flows). */
  showTrailingMenu?: boolean;
};

export function LessonHeader({
  progress,
  onClose,
  onMore,
  onAdminEdit,
  leadingIcon = 'close',
  showTrailingMenu = true,
}: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onClose}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={leadingIcon === 'back' ? mn.common.back : 'Хаах'}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
      >
        <Ionicons
          name={leadingIcon === 'back' ? 'chevron-back' : 'close'}
          size={leadingIcon === 'back' ? 28 : 26}
          color={colors.text.secondary}
        />
      </Pressable>
      <View style={styles.barWrap}>
        <ProgressBar
          value={progress * 100}
          color={colors.brand.primary}
          height={14}
          trackColor={colors.borderLight}
        />
      </View>
      {onAdminEdit ? (
        <Pressable
          onPress={onAdminEdit}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={mn.admin.lessonEdit}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <Ionicons name="create-outline" size={24} color={colors.brand.primary} />
        </Pressable>
      ) : null}
      {showTrailingMenu ? (
        <Pressable
          onPress={onMore}
          hitSlop={12}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <Ionicons name="ellipsis-vertical" size={22} color={colors.text.secondary} />
        </Pressable>
      ) : (
        <View style={styles.trailSpacer} />
      )}
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
  trailSpacer: { width: 34 },
});
