import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { PremiumFeatureList } from './PremiumFeatureList';

export function PremiumSuccessBody() {
  return (
    <View style={styles.center}>
      <View style={styles.confettiRow}>
        <Text style={styles.piece}>▮</Text>
        <Text style={[styles.piece, { color: colors.info }]}>▲</Text>
        <Text style={[styles.piece, { color: colors.warning }]}>●</Text>
      </View>
      <View style={styles.crownCircle}>
        <Ionicons name="ribbon" size={40} color="#FFFFFF" />
      </View>
      <Text style={styles.h1}>{mn.premium.successHeadline}</Text>
      <Text style={styles.sub}>{mn.premium.successSub}</Text>
      <View style={styles.rule} />
      <Text style={styles.benefitHead}>{mn.premium.benefitsTitle}</Text>
      <View style={styles.fullW}>
        <PremiumFeatureList />
      </View>
      <View style={styles.rule} />
      <Text style={styles.foot}>{mn.premium.renewal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  confettiRow: { flexDirection: 'row', gap: 12, marginBottom: spacing.md },
  piece: { fontSize: 14, color: colors.accent.pink },
  crownCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  h1: { ...typography.heading.lg, color: colors.text.primary, textAlign: 'center' },
  sub: {
    ...typography.body.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  rule: { height: 1, backgroundColor: colors.borderLight, width: '100%', marginVertical: spacing.lg },
  benefitHead: { ...typography.heading.sm, alignSelf: 'flex-start', marginBottom: spacing.sm },
  fullW: { width: '100%' },
  foot: { ...typography.body.sm, color: colors.text.muted, textAlign: 'center' },
});
