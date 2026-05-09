import React from 'react';
import { useRouter } from 'expo-router';
import { safeBack } from '../../src/lib/navigation/safeBack';
import { Button, Screen } from '../../src/primitives';
import { BillingToggle } from '../../src/features/premium/BillingToggle';
import { PremiumPlanCard } from '../../src/features/premium/PremiumPlanCard';
import { PremiumScreenHeader } from '../../src/features/premium/PremiumScreenHeader';
import { usePremiumCheckout } from '../../src/features/premium/CheckoutContext';
import { mn } from '../../src/i18n/mn';
import { priceLabel } from '../../src/features/premium/pricing';

export default function PremiumUpgradeScreen() {
  const router = useRouter();
  const { billing, setBilling } = usePremiumCheckout();
  const label = `${mn.common.continue} — ${priceLabel(billing)}`;

  return (
    <Screen scroll scrollBottomInset={24}>
      <PremiumScreenHeader title={mn.premium.upgradeTitle} onBack={() => safeBack(router, '/(tabs)/profile')} />
      <BillingToggle value={billing} onChange={setBilling} />
      <PremiumPlanCard billing={billing} showSaveBadge={billing === 'yearly'} />
      <Button label={label} onPress={() => router.push('/premium/review')} />
    </Screen>
  );
}
