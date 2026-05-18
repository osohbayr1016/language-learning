import React from 'react';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { WorkbookPracticeScreen } from '../../../src/features/lessons/workbookPractice/WorkbookPracticeScreen';

export default function WorkbookPracticeRoute() {
  const { id, adminPreview } = useLocalSearchParams<{ id: string; adminPreview?: string }>();
  const router = useRouter();
  const lessonId = Number(id);
  const adminLessonPreview = adminPreview === '1' || adminPreview === 'true';
  if (!Number.isFinite(lessonId) || lessonId <= 0) {
    return <Redirect href="/study" />;
  }
  return (
    <WorkbookPracticeScreen
      lessonId={lessonId}
      adminLessonPreview={adminLessonPreview}
      onExit={() => router.back()}
    />
  );
}
