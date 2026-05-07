import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export function SuccessStep() {
  return (
    <View style={styles.wrap}>
      <View style={styles.tinyBubble}>
        <Text style={styles.bubbleText}>Hurray!</Text>
      </View>
      <View style={styles.mascotBig}>
        <View style={styles.eyeRow}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <View style={styles.mouth} />
      </View>
      <Text style={styles.title}>{mn.setup.successTitle}</Text>
      <Text style={styles.sub}>{mn.setup.successSub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  tinyBubble: {
    backgroundColor: colors.bg.primary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  bubbleText: { ...typography.heading.md, color: colors.text.primary },
  mascotBig: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    transform: [{ rotate: '-8deg' }],
    marginVertical: spacing.lg,
  },
  eyeRow: { flexDirection: 'row', gap: 18 },
  eye: { width: 16, height: 22, borderRadius: 8, backgroundColor: '#0F172A' },
  mouth: { width: 26, height: 12, borderRadius: 8, backgroundColor: colors.error },
  title: {
    ...typography.heading.xl,
    color: colors.brand.primary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  sub: {
    ...typography.body.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
