import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import type { Chapter } from '../../lib/types';

type Props = {
  chapters: Chapter[];
  loading: boolean;
  activeLessonId: number | null;
  onSelectLesson: (id: number) => void;
};

export function LessonPrepInlineLessonList({
  chapters,
  loading,
  activeLessonId,
  onSelectLesson,
}: Props) {
  if (loading && chapters.length === 0) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.accent.amber} />
      </View>
    );
  }

  const flat = chapters.flatMap((ch) => ch.lessons.map((lesson) => ({ lesson, color: ch.color })));
  return (
    <View style={styles.card}>
      {flat.map((row, ix) => {
        const { lesson, color } = row;
        const lastRow = ix === flat.length - 1;
        const active = lesson.id === activeLessonId;
        const done = !!lesson.progress?.completed_at;
        return (
          <Pressable
            key={lesson.id}
            style={({ pressed }) => [
              styles.row,
              lastRow && styles.rowLast,
              active && { borderLeftWidth: 4, borderLeftColor: color, backgroundColor: `${color}12` },
              pressed && styles.rowPressed,
            ]}
            onPress={() => onSelectLesson(lesson.id)}
          >
            <View style={styles.rowInner}>
              <View
                style={[
                  styles.badge,
                  active && { backgroundColor: `${color}30` },
                  done && !active && styles.badgeDone,
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={16} color={colors.brand.primaryDark} />
                ) : (
                  <Text style={[styles.badgeTxt, active && { color: colors.brand.primaryDark }]}>
                    {lesson.order_num}
                  </Text>
                )}
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle} numberOfLines={2}>
                  {lesson.title_mn}
                </Text>
                {lesson.subtitle_mn ? (
                  <Text style={styles.sub} numberOfLines={2}>
                    {lesson.subtitle_mn}
                  </Text>
                ) : null}
              </View>
              <Ionicons
                name="play-circle"
                size={26}
                color={active ? color : colors.text.muted}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  row: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowPressed: { opacity: 0.92 },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  badge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: { backgroundColor: `${colors.brand.primary}22` },
  badgeTxt: { fontSize: 14, fontWeight: '900', color: colors.text.primary },
  textCol: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  sub: {
    ...typography.body.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});
