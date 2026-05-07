import { Stack } from 'expo-router';
import { SettingsScreen } from '../../src/features/profile/SettingsScreen';
import { mn } from '../../src/i18n/mn';

export default function SettingsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: mn.profile.settings }} />
      <SettingsScreen />
    </>
  );
}
