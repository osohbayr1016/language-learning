export type BillingPeriod = 'monthly' | 'yearly';

export type PaymentMethodId =
  | 'paypal'
  | 'google'
  | 'apple'
  | 'mastercard'
  | 'visa'
  | 'amex';

export const PRICES = { monthly: 4.99, yearly: 49.99 } as const;

export function priceLabel(period: BillingPeriod): string {
  const n = PRICES[period];
  return `$${n.toFixed(2)}`;
}

export function periodSuffix(period: BillingPeriod): string {
  return period === 'monthly' ? '/ сар' : '/ жил';
}
