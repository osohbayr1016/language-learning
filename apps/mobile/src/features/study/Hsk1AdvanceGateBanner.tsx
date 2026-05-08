import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mn } from '../../i18n/mn';
import { colors, radius, spacing, typography } from '../../theme';

/** GET /api/lessons advance_gate_ok — төлөвлөгөө §3 (вэб дээр харагдана). */
export function Hsk1AdvanceGateBanner() {
  return (
    <View style={styles.wrap}>
      <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.icon} />
      <Text style={styles.text}>{mn.study.hsk1AdvanceGateOk}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(88, 204, 2, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.35)',
  },
  icon: { marginRight: spacing.sm, marginTop: 2 },
  text: { ...typography.body.sm, color: colors.text.secondary, flex: 1 },
});
