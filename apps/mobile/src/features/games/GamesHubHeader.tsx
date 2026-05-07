import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export function GamesHubHeader() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{mn.games.hub}</Text>
      <Text style={styles.sub}>{mn.games.hubSub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: spacing.sm, marginBottom: spacing.lg },
  title: { ...typography.heading.xl, color: colors.text.primary },
  sub: { ...typography.body.md, color: colors.text.secondary, marginTop: 4 },
});
