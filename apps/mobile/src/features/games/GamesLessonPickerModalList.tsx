import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import type { Chapter } from '../../lib/types';

type Props = {
  chapters: Chapter[];
  onSelectLesson: (id: number, titleMn: string) => void;
};

export function GamesLessonPickerModalList({ chapters, onSelectLesson }: Props) {
  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      {chapters.map((ch) => (
        <View key={ch.id} style={styles.chapterBlock}>
          <Text style={[styles.chapterHead, { color: ch.color }]}>{ch.title_mn}</Text>
          <View style={styles.card}>
            {ch.lessons.map((lesson, ix) => {
              const last = ix === ch.lessons.length - 1;
              const done = !!lesson.progress?.completed_at;
              return (
                <Pressable
                  key={lesson.id}
                  style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && styles.rowPressed]}
                  onPress={() => onSelectLesson(lesson.id, lesson.title_mn)}
                >
                  <View style={styles.rowInner}>
                    <View style={[styles.badge, done && styles.badgeDone]}>
                      {done ? (
                        <Ionicons name="checkmark" size={16} color={colors.brand.primaryDark} />
                      ) : (
                        <Text style={styles.badgeTxt}>{lesson.order_num}</Text>
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
                    <Ionicons name="chevron-forward" size={22} color={colors.text.muted} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginTop: spacing.sm },
  chapterBlock: { marginBottom: spacing.md },
  chapterHead: {
    ...typography.heading.sm,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.bg.primary,
    ...shadows.sm,
  },
  row: { backgroundColor: colors.bg.card },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
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
