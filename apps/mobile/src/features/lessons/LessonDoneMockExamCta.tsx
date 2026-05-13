import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../primitives';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';
import type { HskLevel, ImportedLessonContent } from '../../lib/types';
import { useLessonDoneMockExam } from './useLessonDoneMockExam';

type Props = {
  token: string | null | undefined;
  imported: ImportedLessonContent | null | undefined;
  chapterHskLevel: HskLevel | undefined;
};

export function LessonDoneMockExamCta({ token, imported, chapterHskLevel }: Props) {
  const router = useRouter();
  const mock = useLessonDoneMockExam(token, imported, chapterHskLevel);

  if (mock.loading || mock.templateId == null) return null;

  return (
    <View style={styles.wrap}>
      <Button
        label={mn.lesson.doneMockExam}
        variant="secondary"
        onPress={() => router.push(`/study/mock-exam?templateId=${mock.templateId}` as never)}
        accessibilityLabel={mn.lesson.doneMockExam}
      />
      {mock.usedHskMaxIdFallback ? (
        <Text style={styles.hint} accessibilityRole="text">
          {mn.lesson.doneMockExamHskFallbackHint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  hint: { ...typography.body.sm, color: colors.text.secondary },
});
