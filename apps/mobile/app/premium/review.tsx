import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { safeBack } from '../../src/lib/navigation/safeBack';
import { Button, Screen } from '../../src/primitives';
import { PremiumPlanCard } from '../../src/features/premium/PremiumPlanCard';
import { PremiumScreenHeader } from '../../src/features/premium/PremiumScreenHeader';
import { SelectedPaymentSummary } from '../../src/features/premium/SelectedPaymentSummary';
import { ProcessingOverlay } from '../../src/features/premium/ProcessingOverlay';
import { usePremiumCheckout } from '../../src/features/premium/CheckoutContext';
import { mn } from '../../src/i18n/mn';
import { priceLabel } from '../../src/features/premium/pricing';

export default function PremiumReviewScreen() {
  const router = useRouter();
  const { billing, paymentId } = usePremiumCheckout();
  const [busy, setBusy] = useState(false);

  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      router.replace('/premium/success');
    }, 1800);
  };

  return (
    <Screen scroll scrollBottomInset={24}>
      <ProcessingOverlay visible={busy} />
      <PremiumScreenHeader title={mn.premium.reviewTitle} onBack={() => safeBack(router, '/premium')} />
      <PremiumPlanCard billing={billing} showSaveBadge={billing === 'yearly'} />
      <SelectedPaymentSummary
        id={paymentId}
        onChange={() => router.push('/premium/payment-methods')}
      />
      <Button
        label={`${mn.premium.confirmPay} — ${priceLabel(billing)}`}
        onPress={pay}
        disabled={busy}
      />
    </Screen>
  );
}
