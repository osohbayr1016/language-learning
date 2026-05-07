import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { LessonScreen } from '../../src/features/lessons/LessonScreen';

export default function LessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonScreen lessonId={Number(id)} />;
}
