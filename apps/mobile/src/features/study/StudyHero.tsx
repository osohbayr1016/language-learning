import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { useGamification } from '../../context/GamificationContext';
import { mn } from '../../i18n/mn';

type Plan = {
  title: string;
  subtitle: string;
  icon: 'albums' | 'school';
  href: string;
};

function planFor(due: number): Plan {
  if (due > 0) {
    return {
      title: mn.study.heroDueTitle,
      subtitle: mn.study.heroDueSubtitle.replace('{n}', String(due)),
      icon: 'albums',
      href: '/study/flashcard',
    };
  }
  return {
    title: mn.study.heroFallbackTitle,
    subtitle: mn.study.heroFallbackSubtitle,
    icon: 'school',
    href: '/study/learn',
  };
}

export function StudyHero() {
  const router = useRouter();
  const { dueToday } = useGamification();
  const p = planFor(dueToday);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${mn.study.recommended}: ${p.title}`}
      onPress={() => router.push(p.href as never)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Text style={styles.kicker}>{mn.study.recommended.toUpperCase()}</Text>
        <Text style={styles.title}>{p.title}</Text>
        <Text style={styles.subtitle}>{p.subtitle}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaLabel}>{mn.study.startNow}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.brand.primary} />
        </View>
      </View>
      <View style={styles.iconBubble}>
        <Ionicons name={p.icon} size={44} color="#FFFFFF" />
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
  iconBubble: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
});
