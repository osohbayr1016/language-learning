import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { LessonDoneMockExamCta } from './LessonDoneMockExamCta';
import type { HskLevel, ImportedLessonContent } from '../../lib/types';
import { interactiveWorkbookQuizCount } from './workbookPractice/collectInteractiveWorkbookQuizItems';

type Props = {
  lessonId?: number;
  enablePostLessonNav: boolean;
  /** When true, workbook practice navigates with `adminPreview` so quiz data loads via admin preview endpoint. */
  workbookPracticeUsesAdminLessonDetail?: boolean;
  nextLesson: { id: number; title_mn: string } | null;
  goNext: () => void;
  onContinue: () => void;
  importedContent?: ImportedLessonContent | null;
  chapterHskLevel?: HskLevel;
};

export function LessonDoneMinimal({
  lessonId,
  enablePostLessonNav,
  workbookPracticeUsesAdminLessonDetail = false,
  nextLesson,
  goNext,
  onContinue,
  importedContent,
  chapterHskLevel,
}: Props) {
  const { token } = useAuth();
  const router = useRouter();

  const practiceCount = useMemo(
    () =>
      importedContent && lessonId != null ? interactiveWorkbookQuizCount(importedContent) : 0,
    [importedContent, lessonId]
  );

  const goWorkbookPractice = () => {
    if (lessonId == null) return;
    const qp = workbookPracticeUsesAdminLessonDetail ? '?adminPreview=1' : '';
    router.push(`/lessons/${lessonId}/workbook-practice${qp}` as never);
  };

  const showWorkbookPractice = lessonId != null && practiceCount > 0;

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <Ionicons name="trophy" size={64} color={colors.warning} />
        <Text style={styles.title}>Хичээл дууслаа!</Text>
      </View>

      <View style={styles.btns}>
        {enablePostLessonNav ? (
          <LessonDoneMockExamCta
            token={token}
            imported={importedContent}
            chapterHskLevel={chapterHskLevel}
          />
        ) : null}
        {showWorkbookPractice ? (
          <Button
            label={mn.lesson.workbookPractice.testMyself}
            variant="secondary"
            onPress={goWorkbookPractice}
            accessibilityLabel={mn.lesson.workbookPractice.testMyself}
          />
        ) : null}
        {enablePostLessonNav && nextLesson ? (
          <Button
            label={`${mn.lesson.continueNextPrefix} ${nextLesson.title_mn}`}
            onPress={goNext}
            accessibilityLabel={`${mn.lesson.continueNextPrefix} ${nextLesson.title_mn}`}
          />
        ) : null}
        <Button
          label={
            enablePostLessonNav ? (nextLesson ? mn.lesson.backToStudy : 'ҮРГЭЛЖЛҮҮЛЭХ') : mn.admin.lessonPreviewDone
          }
          variant={enablePostLessonNav && nextLesson ? 'secondary' : 'primary'}
          onPress={onContinue}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: spacing.lg },
  title: { ...typography.heading.xl, color: colors.text.primary, marginTop: spacing.sm },
  btns: { marginTop: spacing.xl, gap: spacing.md },
});
