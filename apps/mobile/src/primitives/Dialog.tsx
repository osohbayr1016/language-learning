import React from 'react';
import { Modal, StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Button } from './Button';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  confirmLabel?: string;
};

export function Dialog({ visible, title, message, onClose, confirmLabel = 'Ойлголоо' }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <Button label={confirmLabel} onPress={onClose} style={styles.btn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.bg.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...shadows.md,
  },
  title: {
    ...typography.heading.lg,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.body.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actions: {
    alignItems: 'center',
  },
  btn: {
    width: '100%',
  },
});
