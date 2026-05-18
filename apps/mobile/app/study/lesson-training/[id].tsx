import React from 'react';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { LessonTrainingScreen } from '../../../src/features/study/lessonTraining/LessonTrainingScreen';
import { safeBack } from '../../../src/lib/navigation/safeBack';

export default function LessonTrainingRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lessonId = Number(id);
  if (!Number.isFinite(lessonId) || lessonId <= 0) {
    return <Redirect href="/study" />;
  }
  return (
    <LessonTrainingScreen
      lessonId={lessonId}
      onBack={() => safeBack(router, '/study/lesson-prep')}
      pushPath={(path) => router.push(path as never)}
    />
  );
}
