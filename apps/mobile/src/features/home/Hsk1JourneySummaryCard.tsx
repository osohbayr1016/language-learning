import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mn } from '../../i18n/mn';
import { Card } from '../../primitives';
import { colors, radius, spacing, typography } from '../../theme';
import { getFirstLessonId, getPrimaryHsk1Chapter } from '../lessons/hsk1ChapterPick';
import { useLessonChapters } from '../lessons/useLessonChapters';
import type { Lesson } from '../../lib/types';
import { hrefStudyTab } from '../../lib/nav/hrefs';

/** Нүүр — HSK 1 явц, суурь алхмууд руу үргэлжлүүлэх. */
export function Hsk1JourneySummaryCard() {
  const router = useRouter();
  const { chapters, loading } = useLessonChapters();

  const h1 = useMemo(() => getPrimaryHsk1Chapter(chapters), [chapters]);
  const firstId = useMemo(() => getFirstLessonId(h1), [h1]);

  const { completed, total, pct } = useMemo(() => {
    if (!h1?.lessons?.length) return { completed: 0, total: 0, pct: 0 };
    const t = h1.lessons.length;
    const c = h1.lessons.filter((l: Lesson) => l.progress?.completed_at).length;
    return { completed: c, total: t, pct: t ? Math.round((100 * c) / t) : 0 };
  }, [h1]);

  const onContinue = () => {
    if (firstId == null) {
      router.push(hrefStudyTab);
      return;
    }
    const next = h1?.lessons
      .filter((l: Lesson) => !l.progress?.completed_at)
      .sort((a: Lesson, b: Lesson) => a.order_num - b.order_num)[0];
    const id = next?.id ?? firstId;
    router.push(`/lessons/${id}` as never);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  if (!h1) {
    return (
      <Card padding="lg" style={styles.card}>
        <Text style={styles.title}>{mn.study.courseEmptyTitle}</Text>
        <Text style={styles.sub}>{mn.study.courseEmpty}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={mn.study.hsk1JourneyContinue}
          onPress={() => router.push(hrefStudyTab)}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>{mn.study.hsk1JourneyContinue}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.text.inverse} />
        </Pressable>
      </Card>
    );
  }

  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="map-outline" size={22} color={colors.brand.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{mn.study.hsk1JourneyTitle}</Text>
          <Text style={styles.sub}>{mn.study.hsk1JourneySubtitle}</Text>
          <Text style={styles.progress}>
            {mn.study.hsk1JourneyProgress.replace('{c}', String(completed)).replace('{t}', String(total))}
            {total > 0 ? ` · ${pct}%` : ''}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={mn.study.hsk1JourneyContinue}
        onPress={onContinue}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
      >
        <Text style={styles.ctaText}>{mn.study.hsk1JourneyContinue}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.text.inverse} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.md, alignItems: 'center' },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  copy: { flex: 1 },
  title: { ...typography.heading.sm, color: colors.text.primary, marginBottom: 4 },
  sub: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.xs },
  progress: { ...typography.body.sm, color: colors.text.muted, fontWeight: '600' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.brand.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  ctaPressed: { opacity: 0.9 },
  ctaText: { ...typography.body.md, color: colors.text.inverse, fontWeight: '700' as const },
});
