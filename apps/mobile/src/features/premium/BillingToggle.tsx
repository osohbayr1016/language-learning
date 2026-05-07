import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { BillingPeriod } from './pricing';

type Props = { value: BillingPeriod; onChange: (b: BillingPeriod) => void };

export function BillingToggle({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onChange('monthly')}
        style={[styles.seg, value === 'monthly' && styles.segOn]}
      >
        <Text style={[styles.txt, value === 'monthly' && styles.txtOn]}>
          {mn.premium.monthly}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('yearly')}
        style={[styles.seg, value === 'yearly' && styles.segOn]}
      >
        <Text style={[styles.txt, value === 'yearly' && styles.txtOn]}>
          {mn.premium.yearly}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: 20,
  },
  seg: { flex: 1, paddingVertical: 12, borderRadius: radius.md, alignItems: 'center' },
  segOn: { backgroundColor: colors.brand.primary },
  txt: { ...typography.body.md, fontWeight: '600', color: colors.text.primary },
  txtOn: { color: '#FFFFFF' },
});
