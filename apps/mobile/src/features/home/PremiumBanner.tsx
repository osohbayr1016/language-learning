import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = { onPress?: () => void };

export function PremiumBanner({ onPress }: Props) {
  const b = mn.premium.banner;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.left}>
        <Text style={styles.kicker}>{b.kicker}</Text>
        <Text style={styles.title}>{b.title}</Text>
        <Text style={styles.subtitle}>{b.subtitle}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaLabel}>{b.cta}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.brand.primary} />
        </View>
      </View>
      <View style={styles.mascot}>
        <Ionicons name="sparkles" size={48} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderBottomWidth: 4,
    borderBottomColor: colors.brand.primaryShadow,
    ...shadows.md,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  left: { flex: 1 },
  kicker: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    opacity: 0.85,
    marginBottom: 4,
  },
  title: { ...typography.heading.lg, color: '#FFFFFF' },
  subtitle: { ...typography.body.md, color: '#FFFFFF', opacity: 0.9, marginTop: 2 },
  cta: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  ctaLabel: {
    color: colors.brand.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  mascot: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
});
