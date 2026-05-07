import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export function InsightsHeader() {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
      </Pressable>
      <Text style={styles.title}>{mn.insights.title}</Text>
      <View style={styles.back} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  title: { ...typography.heading.lg, color: colors.text.primary },
});
