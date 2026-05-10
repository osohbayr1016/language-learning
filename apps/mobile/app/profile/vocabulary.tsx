import { Stack } from 'expo-router';
import { VocabularyScreen } from '../../src/features/profile/VocabularyScreen';

export default function VocabularyRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <VocabularyScreen />
    </>
  );
}
