import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { BillingPeriod } from './pricing';
import { periodSuffix, priceLabel } from './pricing';
import { PremiumFeatureList } from './PremiumFeatureList';

type Props = { billing: BillingPeriod; showSaveBadge?: boolean };

export function PremiumPlanCard({ billing, showSaveBadge }: Props) {
  const big = priceLabel(billing);
  const small = periodSuffix(billing);
  return (
    <View style={styles.card}>
      {showSaveBadge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{mn.premium.save}</Text>
        </View>
      ) : null}
      <Text style={styles.name}>{mn.premium.planName}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{big}</Text>
        <Text style={styles.period}>{small}</Text>
      </View>
      <View style={styles.rule} />
      <PremiumFeatureList />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.md,
    marginBottom: spacing.lg,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeTxt: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  name: { ...typography.heading.md, textAlign: 'center', marginBottom: spacing.sm },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 6 },
  price: { ...typography.heading.xl, color: colors.text.primary },
  period: { ...typography.body.md, color: colors.text.muted },
  rule: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },
});
