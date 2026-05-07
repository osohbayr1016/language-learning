import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Props = { message: string };

export function MascotBubble({ message }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.mascot}>
        <View style={styles.eyeRow}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <View style={styles.mouth} />
      </View>
      <View style={styles.bubbleWrap}>
        <View style={styles.tail} />
        <View style={styles.bubble}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  mascot: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  eye: {
    width: 10,
    height: 14,
    borderRadius: 5,
    backgroundColor: '#0F172A',
  },
  mouth: {
    width: 18,
    height: 8,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  bubbleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.border,
    marginTop: 14,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  text: {
    ...typography.heading.md,
    color: colors.text.primary,
    lineHeight: 24,
  },
});
