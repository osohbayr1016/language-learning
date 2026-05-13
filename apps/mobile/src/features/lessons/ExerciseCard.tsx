import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { MascotBubble } from './MascotBubble';

type Props = {
  title: string;
  prompt?: string;
  children: React.ReactNode;
};

export function ExerciseCard({ title, prompt, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {prompt ? <MascotBubble message={prompt} /> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.bg.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  title: {
    ...typography.heading.md,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  body: { flex: 1, minHeight: 0, marginTop: spacing.sm },
});
