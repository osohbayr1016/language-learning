import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="add-card" />
      <Stack.Screen name="security" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="invite" />
      <Stack.Screen name="help-center" />
      <Stack.Screen name="customer-service" />
    </Stack>
  );
}
