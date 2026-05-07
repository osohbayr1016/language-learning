import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export function PremiumFeatureList() {
  return (
    <View style={styles.list}>
      {mn.premium.features.map((line) => (
        <View key={line} style={styles.row}>
          <Ionicons name="checkmark" size={18} color={colors.text.primary} style={styles.icon} />
          <Text style={styles.text}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { marginRight: spacing.sm, marginTop: 2 },
  text: { ...typography.body.md, color: colors.text.secondary, flex: 1 },
});
