import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { safeBack } from '../../lib/navigation/safeBack';
import { Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { useAuth } from '../../context/AuthContext';
import { useLessonSession } from './useLessonSession';
import { LessonHeader } from './LessonHeader';
import { LoadingScreen } from './LoadingScreen';
import { ExerciseCard } from './ExerciseCard';
import { FeedbackBanner } from './FeedbackBanner';
import { MoreMenu } from './MoreMenu';
import { LeaveSheet } from './LeaveSheet';
import { LessonDoneScreen } from './LessonDoneScreen';
import {
  ExerciseRenderer,
  exerciseCorrectAnswer,
  exercisePromptFor,
} from './exercises';
import { exerciseDisplayTitle, isImportedLearnFlow } from './types';

export type LessonScreenVariant = 'learn' | 'adminPreview';

type Props = { lessonId: number; variant?: LessonScreenVariant };

export function LessonScreen({ lessonId, variant = 'learn' }: Props) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const isPreview = variant === 'adminPreview';
  const { state, current, submit, advance, submitImportedStep, finalize, accuracy } = useLessonSession(
    lessonId,
    {
      mode: isPreview ? 'adminPreview' : 'default',
    }
  );
  const [banner, setBanner] = useState<{ correct: boolean } | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const exitLesson = () => {
    if (isPreview) {
      safeBack(router, '/admin/learning-path');
      return;
    }
    router.replace('/(tabs)/home');
  };

  useEffect(() => {
    if (state.status === 'done') void finalize();
  }, [state.status, finalize]);

  const onAnswer = (correct: boolean) => {
    if (current?.kind === 'imported-section') {
      submitImportedStep(correct);
      return;
    }
    submit(correct);
    setBanner({ correct });
  };

  const onContinue = () => {
    setBanner(null);
    advance();
  };

  const onLeave = () => {
    setLeaveOpen(false);
    setMoreOpen(false);
    exitLesson();
  };

  if (state.status === 'loading') {
    return (
      <Screen edges={['top', 'bottom']}>
        <LoadingScreen />
      </Screen>
    );
  }

  if (state.status === 'error') {
    return (
      <Screen edges={['top', 'bottom']} padded={false}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{state.error ?? mn.common.error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mn.common.back}
            style={styles.errorBtn}
            onPress={exitLesson}
          >
            <Text style={styles.errorBtnLabel}>{mn.common.back}</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (state.status === 'done') {
    return (
      <LessonDoneScreen
        exercises={state.exercises}
        results={state.results}
        durationSec={state.durationSec}
        xpEarned={state.xpEarned}
        accuracy={accuracy}
        chapterId={state.detail?.chapter_id}
        currentOrderNum={state.detail?.order_num}
        importedContent={state.detail?.imported_content}
        chapterHskLevel={state.detail?.chapter_hsk_level}
        enablePostLessonNav={!isPreview}
        lessonId={lessonId}
        workbookPracticeUsesAdminLessonDetail={isPreview}
        minimalComplete={isImportedLearnFlow(state.exercises) || isPreview}
        onContinue={exitLesson}
      />
    );
  }

  const total = state.exercises.length;
  const progress = total > 0 ? (state.index + (banner ? 1 : 0)) / total : 0;

  return (
    <Screen edges={['top', 'bottom']} padded={false}>
      <View style={styles.headerWrap}>
        <LessonHeader
          progress={progress}
          onClose={isPreview ? exitLesson : () => setLeaveOpen(true)}
          onMore={() => setMoreOpen(true)}
          onAdminEdit={
            isAdmin && !isPreview ? () => router.push(`/admin/lesson/${lessonId}` as never) : undefined
          }
          leadingIcon={isPreview ? 'back' : 'close'}
        />
      </View>

      <View style={styles.body}>
        {current ? (
          <ExerciseCard
            title={exerciseDisplayTitle(current)}
            prompt={exercisePromptFor(current)}
          >
            <ExerciseRenderer
              key={current.id}
              exercise={current}
              lessonWords={state.detail?.words}
              disabled={!!banner}
              onAnswer={onAnswer}
            />
          </ExerciseCard>
        ) : null}
      </View>

      <FeedbackBanner
        visible={!!banner}
        correct={banner?.correct ?? false}
        correctAnswer={current ? exerciseCorrectAnswer(current) : undefined}
        onContinue={onContinue}
      />

      <MoreMenu
        visible={moreOpen}
        onDismiss={() => setMoreOpen(false)}
        onFeedback={() => setMoreOpen(false)}
        onLeave={() => {
          setMoreOpen(false);
          setLeaveOpen(true);
        }}
      />

      <LeaveSheet
        visible={leaveOpen}
        onCancel={() => setLeaveOpen(false)}
        onLeave={onLeave}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: spacing.lg, backgroundColor: colors.bg.primary },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  errorText: { ...typography.body.md, color: colors.text.secondary, textAlign: 'center' },
  errorBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
  },
  errorBtnLabel: { ...typography.body.md, fontWeight: '700' as const, color: '#fff' },
});
