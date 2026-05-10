import { Stack } from 'expo-router';
import { SettingsScreen } from '../../src/features/profile/SettingsScreen';

export default function SettingsRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SettingsScreen />
    </>
  );
}
