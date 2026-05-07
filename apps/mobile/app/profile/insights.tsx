import { Stack } from 'expo-router';
import { InsightsScreen } from '../../src/features/insights/InsightsScreen';

export default function InsightsRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <InsightsScreen />
    </>
  );
}
