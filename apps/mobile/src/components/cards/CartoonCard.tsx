import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pill } from '../../primitives';
import { colors, radius, spacing, typography } from '../../theme';
import type { Cartoon } from '../../lib/api/cartoons';

type Props = { cartoon: Cartoon };

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function CartoonCard({ cartoon }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/cartoons/${cartoon.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.thumb}>
        {cartoon.thumbnail_url ? (
          <Image source={{ uri: cartoon.thumbnail_url }} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
            <Ionicons name="film-outline" size={32} color={colors.text.muted} />
          </View>
        )}
        <View style={styles.playBtn}>
          <Ionicons name="play" size={22} color={colors.text.primary} />
        </View>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{fmtDuration(cartoon.duration_s)}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{cartoon.title_mn}</Text>
        {cartoon.hsk_level ? (
          <Pill
            label={`HSK ${cartoon.hsk_level}`}
            color={colors.hsk[cartoon.hsk_level as keyof typeof colors.hsk] ?? colors.accent.purple}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  thumb: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.bg.elevated,
  },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 56,
    height: 56,
    marginTop: -28,
    marginLeft: -28,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  durationText: { ...typography.body.sm, color: colors.text.primary, fontWeight: '600' },
  body: { padding: spacing.md, gap: spacing.xs },
  title: { ...typography.heading.md, color: colors.text.primary },
});
