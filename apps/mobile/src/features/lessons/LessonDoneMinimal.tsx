import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { LessonDoneMockExamCta } from './LessonDoneMockExamCta';
import type { HskLevel, ImportedLessonContent } from '../../lib/types';

type Props = {
  enablePostLessonNav: boolean;
  nextLesson: { id: number; title_mn: string } | null;
  goNext: () => void;
  onContinue: () => void;
  importedContent?: ImportedLessonContent | null;
  chapterHskLevel?: HskLevel;
};

export function LessonDoneMinimal({
  enablePostLessonNav,
  nextLesson,
  goNext,
  onContinue,
  importedContent,
  chapterHskLevel,
}: Props) {
  const { token } = useAuth();

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
