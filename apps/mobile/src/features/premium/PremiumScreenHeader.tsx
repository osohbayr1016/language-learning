import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

type Props = { title: string; onBack: () => void; right?: React.ReactNode };

export function PremiumScreenHeader({ title, onBack, right }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        hitSlop={12}
        style={[styles.iconBtn, Platform.OS === 'web' && styles.iconBtnWeb]}
      >
        <View pointerEvents="none" accessible={false}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </View>
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right ?? <View style={styles.iconPlaceholder} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBtn: { padding: spacing.xs },
  iconBtnWeb: { cursor: 'pointer' as const },
  iconPlaceholder: { width: 40 },
  title: { ...typography.heading.md, flex: 1, textAlign: 'center', color: colors.text.primary },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
