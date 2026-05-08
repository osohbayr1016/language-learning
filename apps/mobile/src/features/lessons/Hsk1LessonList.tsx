import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { mn } from '../../i18n/mn';
import { Card } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import type { Chapter } from '../../lib/types';
import { ChapterCard } from './ChapterCard';
import { LessonRow } from './LessonRow';

type Props = { chapters: Chapter[] };

/** HSK бүлэг, хичээлийн мөрүүд — Study таб болон бусад хэсэгт давтагдана. */
export function Hsk1LessonList({ chapters }: Props) {
  if (chapters.length === 0) {
    return (
      <Card padding="lg" style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>{mn.study.courseEmptyTitle}</Text>
        <Text style={styles.emptyText}>{mn.study.courseEmpty}</Text>
      </Card>
    );
  }

  return (
    <View>
      {chapters.map((chapter) => {
        const total = chapter.lessons.length;
        const completed = chapter.lessons.filter((l) => l.progress?.completed_at).length;
        const gateLocked = chapter.locked_below_advance_gate === true;
        const isLocked = chapter.is_published === 0 || gateLocked;
        const currentIndex = chapter.lessons.findIndex((l) => !l.progress?.completed_at);

        return (
          <View key={chapter.id}>
            <ChapterCard
              title={chapter.title_mn}
              subtitle={gateLocked ? mn.study.advanceGateHint : chapter.subtitle_mn}
              color={chapter.color}
              completed={completed}
              total={total}
              locked={isLocked}
            />
            {!isLocked &&
              chapter.lessons.map((lesson, i) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  color={chapter.color}
                  current={i === currentIndex}
                  locked={gateLocked}
                />
              ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: { marginBottom: spacing.md },
  emptyTitle: { ...typography.heading.sm, color: colors.text.primary, marginBottom: spacing.xs },
  emptyText: { ...typography.body.md, color: colors.text.secondary },
});
