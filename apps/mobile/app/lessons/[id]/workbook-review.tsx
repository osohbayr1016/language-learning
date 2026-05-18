import React from 'react';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { WorkbookReviewScreen } from '../../../src/features/lessons/workbookReview/WorkbookReviewScreen';

export default function WorkbookReviewRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lessonId = Number(id);
  if (!Number.isFinite(lessonId) || lessonId <= 0) {
    return <Redirect href="/study" />;
  }
  return <WorkbookReviewScreen lessonId={lessonId} onExit={() => router.back()} />;
}
