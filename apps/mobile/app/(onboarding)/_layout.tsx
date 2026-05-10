import { Stack } from 'expo-router';
import { OnboardingLocaleProvider } from '../../src/features/onboarding/OnboardingLocaleContext';
import { colors } from '../../src/theme';

export default function OnboardingLayout() {
  return (
    <OnboardingLocaleProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.primary },
        }}
      />
    </OnboardingLocaleProvider>
  );
}
