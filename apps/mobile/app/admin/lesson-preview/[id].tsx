import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { LessonScreen } from '../../../src/features/lessons/LessonScreen';

export default function AdminLessonPreviewRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const lessonId = Number(id);

  if (!isAdmin) {
    return <Redirect href="/admin" />;
  }
  if (!Number.isFinite(lessonId) || lessonId <= 0) {
    return <Redirect href="/admin/learning-path" />;
  }

  return <LessonScreen lessonId={lessonId} variant="adminPreview" />;
}
