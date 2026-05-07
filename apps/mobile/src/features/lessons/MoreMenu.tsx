import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onFeedback: () => void;
  onLeave: () => void;
};

export function MoreMenu({ visible, onDismiss, onFeedback, onLeave }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <View style={styles.menu}>
          <MenuItem
            icon="chatbubble-ellipses-outline"
            label="Санал илгээх"
            color={colors.text.primary}
            onPress={onFeedback}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="exit-outline"
            label="Хичээлээс гарах"
            color={colors.error}
            onPress={onLeave}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

function MenuItem({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.itemLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'flex-end', paddingTop: 56, paddingRight: spacing.md },
  menu: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    minWidth: 220,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  itemLabel: { ...typography.body.lg, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.borderLight, marginHorizontal: spacing.md },
});
