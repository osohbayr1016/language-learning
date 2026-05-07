import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

type Props = {
  title: string;
  subtitle?: string;
};

export function AuthHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeChar}>中</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.accent.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  badgeChar: {
    fontSize: 36,
    color: colors.text.primary,
    fontWeight: '300',
  },
  title: {
    ...typography.heading.xl,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body.lg,
    color: colors.text.secondary,
  },
});
