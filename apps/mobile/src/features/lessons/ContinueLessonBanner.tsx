import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import type { Lesson } from '../../lib/types';
import { mn } from '../../i18n/mn';

type Props = {
  lesson: Lesson;
  accentColor: string;
};

export function ContinueLessonBanner({ lesson, accentColor }: Props) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/lessons/${lesson.id}` as never)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.cardMain}>
        <View style={[styles.iconBox, { backgroundColor: `${accentColor}33` }]}>
          <Ionicons name="play-circle-outline" size={28} color={accentColor} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.kicker}>{mn.home.continueLessonKicker}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {lesson.title_mn}
          </Text>
          {lesson.subtitle_mn ? (
            <Text style={styles.sub} numberOfLines={1}>
              {lesson.subtitle_mn}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.text.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: spacing.md,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.md,
  },
  pressed: { opacity: 0.92 },
  accentBar: {
    width: 5,
    borderTopLeftRadius: radius.lg - 2,
    borderBottomLeftRadius: radius.lg - 2,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, minWidth: 0 },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: colors.text.muted,
    marginBottom: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  sub: { ...typography.body.md, fontWeight: '600', color: colors.text.secondary, marginTop: spacing.xs },
});
