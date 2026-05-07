import React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/primitives';
import { PaymentMethodCard } from '../../src/features/premium/PaymentMethodCard';
import { PremiumScreenHeader } from '../../src/features/premium/PremiumScreenHeader';
import { usePremiumCheckout } from '../../src/features/premium/CheckoutContext';
import { PAYMENT_ORDER } from '../../src/features/premium/paymentData';
import { mn } from '../../src/i18n/mn';
import { colors } from '../../src/theme';

export default function PremiumPaymentMethodsScreen() {
  const router = useRouter();
  const { paymentId, setPaymentId } = usePremiumCheckout();
  return (
    <Screen scroll scrollBottomInset={24}>
      <PremiumScreenHeader
        title={mn.premium.paymentTitle}
        onBack={() => router.back()}
        right={
          <Pressable hitSlop={12} onPress={() => {}}>
            <Ionicons name="add-circle-outline" size={26} color={colors.brand.primary} />
          </Pressable>
        }
      />
      {PAYMENT_ORDER.map((id) => (
        <PaymentMethodCard
          key={id}
          id={id}
          selected={paymentId === id}
          onSelect={() => setPaymentId(id)}
        />
      ))}
      <Button label={mn.common.continue} onPress={() => router.back()} />
    </Screen>
  );
}
