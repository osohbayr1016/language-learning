import { Stack } from 'expo-router';
import { AvatarPickerScreen } from '../../src/features/profile/AvatarPickerScreen';

export default function AvatarRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AvatarPickerScreen />
    </>
  );
}
