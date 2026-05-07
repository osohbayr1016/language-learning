import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { PaymentMethodId } from './pricing';
import { PAYMENT_LAST4 } from './paymentData';

type Props = { id: PaymentMethodId; onChange: () => void };

function sub(id: PaymentMethodId): string {
  const last = PAYMENT_LAST4[id];
  if (last) return mn.premium.cardMask.replace('{last4}', last);
  if (id === 'paypal') return mn.premium.paySub.paypal;
  if (id === 'google') return mn.premium.paySub.google;
  return mn.premium.paySub.apple;
}

export function SelectedPaymentSummary({ id, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.section}>{mn.premium.selectedPayment}</Text>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="card-outline" size={20} color={colors.brand.primary} />
        </View>
        <View style={styles.mid}>
          <Text style={styles.title}>{mn.premium.pay[id]}</Text>
          <Text style={styles.sub}>{sub(id)}</Text>
        </View>
        <Pressable onPress={onChange} hitSlop={8}>
          <Text style={styles.change}>{mn.premium.change}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  section: { ...typography.heading.sm, color: colors.text.primary, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: `${colors.brand.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mid: { flex: 1 },
  title: { ...typography.body.md, fontWeight: '700' },
  sub: { ...typography.body.sm, color: colors.text.muted, marginTop: 2 },
  change: { ...typography.body.md, color: colors.brand.primary, fontWeight: '700' },
});
