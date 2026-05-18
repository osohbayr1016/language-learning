import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';

export function WorkbookPracticeDonePanel({
  correctCount,
  total,
  onExit,
}: {
  correctCount: number;
  total: number;
  onExit: () => void;
}) {
  const acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{mn.lesson.workbookPractice.resultTitle}</Text>
      <Text style={styles.sub}>
        {mn.lesson.workbookPractice.resultAccuracy.replace('{n}', String(acc))}
      </Text>
      <Text style={styles.meta}>
        {correctCount} / {total}
      </Text>
      <Button label={mn.lesson.workbookPractice.backStudy} onPress={onExit} variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  title: { ...typography.heading.xl, color: colors.text.primary, textAlign: 'center' },
  sub: { ...typography.body.md, color: colors.text.secondary, textAlign: 'center' },
  meta: { ...typography.body.md, color: colors.text.muted, textAlign: 'center', fontWeight: '700' },
});
