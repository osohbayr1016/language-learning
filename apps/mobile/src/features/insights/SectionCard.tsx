import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme';

type Props = {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function SectionCard({ title, right, children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        {right ?? null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: { ...typography.heading.md, color: colors.text.primary },
});
