import { Stack } from 'expo-router';
import { PremiumCheckoutProvider } from '../../src/features/premium/CheckoutContext';
import { colors } from '../../src/theme';

export default function PremiumLayout() {
  return (
    <PremiumCheckoutProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.primary },
        }}
      />
    </PremiumCheckoutProvider>
  );
}
