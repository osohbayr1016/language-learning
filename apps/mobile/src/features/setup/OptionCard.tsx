import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
};

export function OptionCard({ title, subtitle, selected, onPress, icon }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <View style={styles.body}>
        <Text style={[styles.title, selected && styles.selectedText]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, selected && styles.selectedSub]}>{subtitle}</Text>
        ) : null}
      </View>
      {selected ? (
        <Ionicons name="checkmark" size={26} color={colors.brand.primary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg.primary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  selected: {
    borderColor: colors.brand.primary,
    backgroundColor: '#F1FFE8',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  title: {
    ...typography.heading.md,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body.md,
    color: colors.text.muted,
    marginTop: 2,
  },
  selectedText: { color: colors.brand.primaryDark },
  selectedSub: { color: colors.brand.primary },
});
