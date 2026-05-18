import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LessonDetail } from '../../../lib/types';
import { colors, radius, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';
import { interactiveWorkbookQuizCount } from '../../lessons/workbookPractice/collectInteractiveWorkbookQuizItems';
import { workbookReviewRowCount } from '../../lessons/workbookReview/collectWorkbookReviewRows';

export function LessonTrainingQuickLinks({
  detail,
  lessonId,
  pushPath,
}: {
  detail: LessonDetail;
  lessonId: number;
  pushPath: (path: string) => void;
}) {
  const imp = detail.imported_content;
  const { reviewCount, quizCount } = useMemo(() => {
    if (!imp) return { reviewCount: 0, quizCount: 0 };
    return {
      reviewCount: workbookReviewRowCount(imp),
      quizCount: interactiveWorkbookQuizCount(imp),
    };
  }, [imp]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.ctaHead}>{mn.study.lessonPrepActionsHeading}</Text>
      <View style={styles.grid}>
        <PrepLink label={mn.study.lessonPrepReplayLesson} onPress={() => pushPath(`/lessons/${lessonId}`)} />
        {reviewCount > 0 ? (
          <PrepLink
            label={mn.study.lessonPrepWorkbookAnswers}
            onPress={() => pushPath(`/lessons/${lessonId}/workbook-review`)}
          />
        ) : null}
        {quizCount > 0 ? (
          <PrepLink
            label={mn.lesson.workbookPractice.testMyself}
            onPress={() => pushPath(`/lessons/${lessonId}/workbook-practice`)}
          />
        ) : null}
      </View>
    </View>
  );
}

function PrepLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.link} onPress={onPress}>
      <Text style={styles.linkTxt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  ctaHead: {
    ...typography.body.sm,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  link: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
  },
  linkTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
