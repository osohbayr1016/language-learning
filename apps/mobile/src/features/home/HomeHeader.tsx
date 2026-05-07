import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StreakFlame } from '../../components/gamification';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = { name: string; streak: number };

export function HomeHeader({ name, streak }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.hello}>{mn.home.hello},</Text>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
      </View>
      <StreakFlame days={streak} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  hello: { ...typography.body.lg, color: colors.text.secondary },
  name: { ...typography.heading.lg, color: colors.text.primary },
});
