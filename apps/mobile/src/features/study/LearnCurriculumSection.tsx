import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import type { HskLevel } from '../../lib/types';
import { Hsk1LessonList } from '../lessons/Hsk1LessonList';
import { ContinueLessonBanner } from '../lessons/ContinueLessonBanner';
import { HskLevelPicker } from '../lessons/HskLevelPicker';
import { findNextLesson, uniqueSortedHskLevels } from '../lessons/lessonPathUtils';
import { useLessonChapters } from '../lessons/useLessonChapters';
import { colors, spacing, typography } from '../../theme';

export type LearnCurriculumSectionProps = {
  /** Зөвхөн энэ HSK түвшин хүртэлх бүлгүүд (жишээ нь Сурах табт 1–3). undefined = бүгд */
  maxHskLevel?: HskLevel;
  showContinue?: boolean;
  listTitle: string;
};

export function LearnCurriculumSection({
  maxHskLevel,
  showContinue,
  listTitle,
}: LearnCurriculumSectionProps) {
  const { chapters, loading, refresh } = useLessonChapters();

  useFocusEffect(
    useCallback(() => {
      if (!showContinue) return;
      void refresh();
    }, [showContinue, refresh])
  );
  const baseChapters = useMemo(
    () =>
      maxHskLevel == null
        ? chapters
        : chapters.filter((c) => c.hsk_level <= maxHskLevel),
    [chapters, maxHskLevel]
  );

  const levels = useMemo(() => uniqueSortedHskLevels(baseChapters), [baseChapters]);
  const [selectedHsk, setSelectedHsk] = useState<HskLevel | null>(null);

  useEffect(() => {
    if (levels.length === 0) return;
    setSelectedHsk((prev) => {
      if (prev !== null && levels.includes(prev)) return prev;
      const next = findNextLesson(baseChapters);
      return next?.chapter.hsk_level ?? levels[0];
    });
  }, [levels, baseChapters]);

  const listChapters = useMemo(
    () => baseChapters.filter((c) => c.hsk_level === selectedHsk),
    [baseChapters, selectedHsk]
  );

  const next = useMemo(() => findNextLesson(baseChapters), [baseChapters]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <View>
      {showContinue && next ? (
        <ContinueLessonBanner lesson={next.lesson} accentColor={next.chapter.color} />
      ) : null}
      <Text style={styles.listTitle}>{listTitle}</Text>
      <HskLevelPicker levels={levels} selected={selectedHsk} onSelect={setSelectedHsk} />
      <Animated.View key={selectedHsk ?? 0} entering={FadeIn.duration(260)}>
        <Hsk1LessonList chapters={listChapters} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.xl, alignItems: 'center' },
  listTitle: {
    ...typography.heading.lg,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
});
