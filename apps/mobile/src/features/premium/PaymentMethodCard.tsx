import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { PaymentMethodId } from './pricing';
import { PAYMENT_LAST4 } from './paymentData';

type Props = {
  id: PaymentMethodId;
  selected: boolean;
  onSelect: () => void;
};

function subtitle(id: PaymentMethodId): string {
  const last = PAYMENT_LAST4[id];
  if (last) return mn.premium.cardMask.replace('{last4}', last);
  const s = mn.premium.paySub;
  if (id === 'paypal') return s.paypal;
  if (id === 'google') return s.google;
  return s.apple;
}

function label(id: PaymentMethodId): string {
  return mn.premium.pay[id];
}

export function PaymentMethodCard({ id, selected, onSelect }: Props) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardOn,
        pressed && { opacity: 0.95 },
      ]}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="wallet-outline" size={22} color={colors.brand.primary} />
      </View>
      <View style={styles.mid}>
        <Text style={styles.title}>{label(id)}</Text>
        <Text style={styles.sub}>{subtitle(id)}</Text>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={26} color={colors.brand.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  cardOn: { borderColor: colors.brand.primary },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: `${colors.brand.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mid: { flex: 1 },
  title: { ...typography.body.md, fontWeight: '700', color: colors.text.primary },
  sub: { ...typography.body.sm, color: colors.text.muted, marginTop: 2 },
});
