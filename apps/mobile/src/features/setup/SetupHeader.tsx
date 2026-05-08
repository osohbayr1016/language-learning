import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  current: number;
  total: number;
  onBack: () => void;
  showCounter?: boolean;
};

export function SetupHeader({ current, total, onBack, showCounter = true }: Props) {
  const pct = Math.max(0, Math.min(1, current / total));

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        hitSlop={12}
        onPress={onBack}
        style={[styles.back, Platform.OS === 'web' && styles.backWeb]}
      >
        <View pointerEvents="none" accessible={false}>
          <Ionicons name="arrow-back" size={26} color={colors.text.secondary} />
        </View>
      </Pressable>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>
      {showCounter ? (
        <Text style={styles.counter}>
          {mn.setup.progress.replace('{n}', String(current)).replace('{total}', String(total))}
        </Text>
      ) : (
        <View style={styles.counterPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  back: { padding: 4 },
  backWeb: { cursor: 'pointer' as const },
  track: {
    flex: 1,
    height: 14,
    backgroundColor: colors.borderLight,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.full,
  },
  counter: {
    ...typography.heading.sm,
    color: colors.text.secondary,
    minWidth: 50,
    textAlign: 'right',
  },
  counterPlaceholder: { minWidth: 50 },
});
