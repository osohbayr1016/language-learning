import { Stack } from 'expo-router';
import { AuthLocaleProvider } from '../../src/features/auth/AuthLocaleContext';
import { colors } from '../../src/theme';

export default function AuthLayout() {
  return (
    <AuthLocaleProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.primary },
        }}
      />
    </AuthLocaleProvider>
  );
}
