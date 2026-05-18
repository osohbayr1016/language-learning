import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';
import { useLessonGameDetail } from '../../../hooks/useLessonGameDetail';
import { buildLessonSpeakPracticeWords } from './buildLessonSpeakPracticeWords';
import { buildLessonShadowTargets } from './buildLessonShadowTargets';
import { LessonTrainingImportedSections } from './LessonTrainingImportedSections';
import { LessonTrainingQuickLinks } from './LessonTrainingQuickLinks';
import { LessonTrainingShadowSection } from './LessonTrainingShadowSection';
import { LessonTrainingSpeakSection } from './LessonTrainingSpeakSection';
import { LessonTrainingStatsRow } from './LessonTrainingStatsRow';

export function LessonTrainingScreen({
  lessonId,
  onBack,
  pushPath,
}: {
  lessonId: number;
  onBack: () => void;
  pushPath: (path: string) => void;
}) {
  const { detail, loading, error } = useLessonGameDetail(String(lessonId));

  const speakWords = useMemo(() => (detail ? buildLessonSpeakPracticeWords(detail) : []), [detail]);
  const shadowTargets = useMemo(() => (detail ? buildLessonShadowTargets(detail) : []), [detail]);

  if (loading) {
    return (
      <Screen scroll scrollBottomInset={70}>
        <TrainingBackBar onBack={onBack} />
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
          <Text style={styles.muted}>{mn.common.loading}</Text>
        </View>
      </Screen>
    );
  }

  if (error || !detail) {
    return (
      <Screen scroll scrollBottomInset={70}>
        <TrainingBackBar onBack={onBack} />
        <Text style={styles.err}>{error ?? mn.study.lessonTrainingLoadError}</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll scrollBottomInset={70}>
      <TrainingBackBar onBack={onBack} />
      <Text style={styles.title}>{detail.title_mn}</Text>
      {detail.subtitle_mn ? <Text style={styles.sub}>{detail.subtitle_mn}</Text> : null}
      <Text style={styles.kicker}>{mn.study.lessonTrainingSubtitle}</Text>

      <LessonTrainingStatsRow imp={detail.imported_content} />
      <LessonTrainingQuickLinks detail={detail} lessonId={lessonId} pushPath={pushPath} />
      <LessonTrainingImportedSections detail={detail} />
      <LessonTrainingSpeakSection words={speakWords} />
      <LessonTrainingShadowSection targets={shadowTargets} />

      <View style={styles.spacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginHorizontal: -spacing.xs,
  },
  backHit: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backHitPressed: { opacity: 0.65 },
  center: { paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.sm },
  muted: { ...typography.body.sm, color: colors.text.muted },
  err: { ...typography.body.md, color: colors.error, marginTop: spacing.md },
  title: { ...typography.heading.lg, color: colors.text.primary, marginTop: spacing.sm },
  sub: { ...typography.body.md, color: colors.text.secondary, marginTop: spacing.xs, fontWeight: '600' },
  kicker: {
    ...typography.body.sm,
    color: colors.brand.primaryDark,
    fontWeight: '800',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  spacer: { height: spacing.xl },
});

function TrainingBackBar({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.backRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={mn.common.back}
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [styles.backHit, pressed && styles.backHitPressed]}
      >
        <Ionicons name="arrow-back" size={26} color={colors.text.primary} />
      </Pressable>
    </View>
  );
}
