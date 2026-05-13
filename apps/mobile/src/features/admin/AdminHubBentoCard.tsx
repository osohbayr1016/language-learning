import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';

export type HubShortcut = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  href: Href;
};

export function AdminHubBentoCard({ title, icon, color, href }: HubShortcut) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconBg, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  pressed: { opacity: 0.9 },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading.sm,
    flex: 1,
    color: colors.text.primary,
    fontWeight: '700',
  },
});
