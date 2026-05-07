import React from 'react';
import { useRouter } from 'expo-router';
import { Button, Screen } from '../../src/primitives';
import { PremiumSuccessBody } from '../../src/features/premium/PremiumSuccessBody';
import { mn } from '../../src/i18n/mn';

export default function PremiumSuccessScreen() {
  const router = useRouter();
  return (
    <Screen scroll scrollBottomInset={24}>
      <PremiumSuccessBody />
      <Button
        label={mn.premium.startPremium}
        onPress={() => router.replace('/(tabs)/home')}
      />
    </Screen>
  );
}
