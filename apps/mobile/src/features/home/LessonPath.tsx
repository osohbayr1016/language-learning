import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { colors, spacing } from '../../theme';
import type { Chapter } from '../../lib/types';
import { ChapterCard } from './ChapterCard';
import { LessonRow } from './LessonRow';

export function LessonPath() {
  const { token } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        const res = await api.lessons.list(token);
        if (!cancelled) setChapters(res.data ?? []);
      } catch {
        if (!cancelled) setChapters([]);
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

  if (chapters.length === 0) return null;

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
});
