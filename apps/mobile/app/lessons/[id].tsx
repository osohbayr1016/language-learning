import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { LessonScreen } from '../../src/features/lessons/LessonScreen';

export default function LessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = Number(id);
  if (!Number.isFinite(lessonId) || lessonId <= 0) {
    return <Redirect href="/study" />;
  }
  return <LessonScreen lessonId={lessonId} />;
}
