import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { HskLevel } from '../../lib/types';
import { Button, Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { useLessonChapters } from '../lessons/useLessonChapters';
import {
  chaptersForLessonPrepPicker,
  findNextLesson,
  uniqueSortedHskLevels,
} from '../lessons/lessonPathUtils';
import { HskLevelPicker } from '../lessons/HskLevelPicker';
import { LessonPrepInlineLessonList } from './LessonPrepInlineLessonList';
import { LessonPrepLessonStepper, type LessonPrepStepItem } from './LessonPrepLessonStepper';

function parseHskParam(raw: string | string[] | undefined): HskLevel | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v == null || v === '') return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 6) return null;
  return n as HskLevel;
}

export default function LessonPrepScreen() {
  const router = useRouter();
  const { hsk } = useLocalSearchParams<{ hsk?: string | string[] }>();
  const hskFromRoute = parseHskParam(hsk);
  const { chapters, loading } = useLessonChapters();

  const allPickerChapters = useMemo(() => chaptersForLessonPrepPicker(chapters, null), [chapters]);
  const levels = useMemo(() => uniqueSortedHskLevels(allPickerChapters), [allPickerChapters]);

  const [selectedHsk, setSelectedHsk] = useState<HskLevel | null>(null);
  const [focusedLessonId, setFocusedLessonId] = useState<number | null>(null);

  useEffect(() => {
    if (levels.length === 0) {
      setSelectedHsk(null);
      return;
    }
    if (hskFromRoute != null && levels.includes(hskFromRoute)) {
      setSelectedHsk(hskFromRoute);
      return;
    }
    if (hskFromRoute != null) {
      setSelectedHsk(levels[0]);
      return;
    }
    setSelectedHsk((prev) => {
      if (prev != null && levels.includes(prev)) return prev;
      const next = findNextLesson(allPickerChapters);
      return next?.chapter.hsk_level ?? levels[0];
    });
  }, [levels, allPickerChapters, hskFromRoute]);

  const pickerChapters = useMemo(
    () => chaptersForLessonPrepPicker(chapters, selectedHsk),
    [chapters, selectedHsk]
  );

  const stepItems: LessonPrepStepItem[] = useMemo(
    () =>
      pickerChapters.flatMap((ch) =>
        ch.lessons.map((lesson) => ({ lesson, chapterColor: ch.color }))
      ),
    [pickerChapters]
  );

  useEffect(() => {
    if (stepItems.length === 0) {
      setFocusedLessonId(null);
      return;
    }
    const ix = stepItems.findIndex(({ lesson }) => !lesson.progress?.completed_at);
    const pick = stepItems[ix >= 0 ? ix : 0];
    setFocusedLessonId(pick.lesson.id);
  }, [selectedHsk, stepItems]);

  const goTraining = (lessonId: number) => {
    router.push(`/study/lesson-training/${lessonId}` as never);
  };

  const hasHskRoute = hskFromRoute != null;

  return (
    <Screen scroll scrollBottomInset={70}>
      {hasHskRoute ? (
        <Button
          label={mn.common.back}
          onPress={() => router.back()}
          variant="secondary"
          accessibilityLabel={mn.common.back}
        />
      ) : null}
      <Text style={[styles.title, hasHskRoute && styles.titleAfterBack]}>{mn.study.lessonPrepTitle}</Text>
      <Text style={styles.desc}>{mn.study.lessonPrepDesc}</Text>

      {selectedHsk != null ? (
        <View style={styles.countPill}>
          <Text style={styles.countTxt}>{mn.study.lessonPrepLessonCount.replace('{n}', String(stepItems.length))}</Text>
        </View>
      ) : null}

      {!loading && levels.length === 0 ? (
        <Text style={styles.warn}>{mn.study.lessonPrepNoLessonsForHsk}</Text>
      ) : null}

      {levels.length > 1 ? (
        <HskLevelPicker levels={levels} selected={selectedHsk} onSelect={setSelectedHsk} />
      ) : null}

      {selectedHsk != null && !loading && pickerChapters.length === 0 ? (
        <Text style={styles.warn}>{mn.study.lessonPrepNoLessonsForHsk}</Text>
      ) : null}

      {selectedHsk != null ? (
        <Animated.View key={selectedHsk} entering={FadeIn.duration(280)} exiting={FadeOut.duration(140)}>
          <LessonPrepLessonStepper
            items={stepItems}
            activeLessonId={focusedLessonId}
            onStepPress={setFocusedLessonId}
          />
          <LessonPrepInlineLessonList
            chapters={pickerChapters}
            loading={loading}
            activeLessonId={focusedLessonId}
            onSelectLesson={(id) => {
              setFocusedLessonId(id);
              goTraining(id);
            }}
          />
        </Animated.View>
      ) : null}

      <View style={styles.spacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.xs },
  titleAfterBack: { marginTop: spacing.sm },
  desc: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.sm, lineHeight: 21 },
  countPill: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.brand.primary}18`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  countTxt: { ...typography.body.sm, fontWeight: '800', color: colors.brand.primaryDark },
  warn: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.sm },
  spacer: { height: spacing.xl },
});
