import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { mn } from '../../i18n/mn';
import { Card } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import type { Chapter } from '../../lib/types';
import { ChapterCard } from './ChapterCard';
import { LessonRow } from './LessonRow';

/** Сурах / Нүүр дээр давтагдан ашиглагдана — API-аас HSK хичээлийн замыг татаж харуулна. */
export function LessonPath() {
  const { token } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        let next: Chapter[] = [];
        if (token) {
          try {
            const res = await api.lessons.list(token);
            next = res.data ?? [];
          } catch {
            next = [];
          }
        }
        if (!cancelled && next.length === 0) {
          try {
            const pub = await api.lessons.catalog();
            next = pub.data ?? [];
          } catch {
            next = [];
          }
        }
        if (!cancelled) setChapters(next);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

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
        const isLocked = chapter.is_published === 0;
        const currentIndex = chapter.lessons.findIndex((l) => !l.progress?.completed_at);

        return (
          <View key={chapter.id}>
            <ChapterCard
              title={chapter.title_mn}
              subtitle={chapter.subtitle_mn}
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
                />
              ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.xl, alignItems: 'center' },
  emptyCard: { marginBottom: spacing.md },
  emptyTitle: { ...typography.heading.sm, color: colors.text.primary, marginBottom: spacing.xs },
  emptyText: { ...typography.body.md, color: colors.text.secondary },
});
