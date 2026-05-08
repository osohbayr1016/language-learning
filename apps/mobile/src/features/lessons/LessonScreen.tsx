import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
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
import { EXERCISE_TITLES } from './types';

type Props = { lessonId: number };

export function LessonScreen({ lessonId }: Props) {
  const router = useRouter();
  const { state, current, submit, advance, finalize, accuracy } = useLessonSession(lessonId);
  const [banner, setBanner] = useState<{ correct: boolean } | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  useEffect(() => {
    if (state.status === 'done') void finalize();
  }, [state.status, finalize]);

  const onAnswer = (correct: boolean) => {
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
    router.replace('/(tabs)/home');
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
          <Pressable style={styles.errorBtn} onPress={() => router.replace('/(tabs)/home')}>
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
        onContinue={() => router.replace('/(tabs)/home')}
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
          onClose={() => setLeaveOpen(true)}
          onMore={() => setMoreOpen(true)}
        />
      </View>

      <View style={styles.body}>
        {current ? (
          <ExerciseCard
            title={EXERCISE_TITLES[current.kind]}
            prompt={exercisePromptFor(current)}
          >
            <ExerciseRenderer
              key={current.id}
              exercise={current}
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
