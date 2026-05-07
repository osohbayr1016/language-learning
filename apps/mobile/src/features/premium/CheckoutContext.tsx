import React, { createContext, useContext, useMemo, useState } from 'react';
import type { BillingPeriod, PaymentMethodId } from './pricing';

type Ctx = {
  billing: BillingPeriod;
  setBilling: (b: BillingPeriod) => void;
  paymentId: PaymentMethodId;
  setPaymentId: (id: PaymentMethodId) => void;
};

const PremiumCheckoutCtx = createContext<Ctx | null>(null);

export function PremiumCheckoutProvider({ children }: { children: React.ReactNode }) {
  const [billing, setBilling] = useState<BillingPeriod>('yearly');
  const [paymentId, setPaymentId] = useState<PaymentMethodId>('mastercard');
  const v = useMemo(
    () => ({ billing, setBilling, paymentId, setPaymentId }),
    [billing, paymentId]
  );
  return (
    <PremiumCheckoutCtx.Provider value={v}>{children}</PremiumCheckoutCtx.Provider>
  );
}

export function usePremiumCheckout() {
  const c = useContext(PremiumCheckoutCtx);
  if (!c) throw new Error('usePremiumCheckout requires PremiumCheckoutProvider');
  return c;
}
