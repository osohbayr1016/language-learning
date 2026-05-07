import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { gameByKey } from './registry';
import type { GameSessionRow } from './useGamesStats';

type Props = { lastPlayed: GameSessionRow | null };

function shadeFor(color: string): string {
  return color === colors.accent.purple ? colors.brand.primaryShadow : color;
}

export function GamesHero({ lastPlayed }: Props) {
  const router = useRouter();
  const meta = gameByKey(lastPlayed?.game_type);
  const subtitle = lastPlayed
    ? `${mn.games.lastPlayed}: ${lastPlayed.score} ${mn.games.scoreUnit}`
    : mn.games.noHistory;

  return (
    <Pressable
      onPress={() => router.push(meta.href as never)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: meta.color, borderBottomColor: shadeFor(meta.color) },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <Text style={styles.kicker}>{mn.games.recommended.toUpperCase()}</Text>
        <Text style={styles.title}>{meta.title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.cta}>
          <Text style={[styles.ctaLabel, { color: meta.color }]}>{mn.games.startNow}</Text>
          <Ionicons name="arrow-forward" size={16} color={meta.color} />
        </View>
      </View>
      <View style={styles.iconBubble}>
        <Ionicons name={meta.iconSolid} size={44} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderBottomWidth: 4,
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
  ctaLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
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
