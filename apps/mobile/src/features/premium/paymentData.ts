import type { PaymentMethodId } from './pricing';

export const PAYMENT_LAST4: Partial<Record<PaymentMethodId, string>> = {
  mastercard: '4679',
  visa: '4242',
  amex: '1001',
};

export const PAYMENT_ORDER: PaymentMethodId[] = [
  'paypal',
  'google',
  'apple',
  'mastercard',
  'visa',
  'amex',
];
