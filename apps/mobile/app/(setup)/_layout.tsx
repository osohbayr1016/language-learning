import { Stack } from 'expo-router';

export default function SetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="pin" />
      <Stack.Screen name="fingerprint" />
    </Stack>
  );
}
