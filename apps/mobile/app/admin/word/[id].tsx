import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { AdminWordDetailScreen } from '../../../src/features/admin/AdminWordDetailScreen';

export default function AdminWordDetailRoute() {
  const { id } = useLocalSearchParams();
  const wordId = Number(id);

  if (!wordId || isNaN(wordId)) {
    return null;
  }

  return <AdminWordDetailScreen wordId={wordId} />;
}
