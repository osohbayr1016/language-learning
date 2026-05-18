import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ImportedLessonContent } from '../../../lib/types';
import { colors, radius, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';

const styles = StyleSheet.create({
  p: { ...typography.body.sm, color: colors.text.secondary, lineHeight: 21 },
  block: {
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bg.secondary,
    gap: spacing.xs,
  },
  char: { ...typography.heading.md, color: colors.text.primary, fontWeight: '800' },
  name: { ...typography.body.md, color: colors.text.primary, fontWeight: '700' },
  note: { ...typography.body.sm, color: colors.text.secondary },
});

export function RadicalsPane({ content }: { content: ImportedLessonContent }) {
  const rows = content.radicals ?? [];
  if (!rows.length) {
    return <Text style={styles.p}>{mn.lesson.importedEmptyRadicals}</Text>;
  }
  return (
    <>
      {rows.map((r, i) => (
        <View key={`${r.char}-${i}`} style={styles.block}>
          <Text style={styles.char}>{r.char}</Text>
          <Text style={styles.name}>{r.name_mn}</Text>
          {r.variant ? <Text style={styles.note}>Хувилбар: {r.variant}</Text> : null}
          {r.note_mn ? <Text style={styles.note}>{r.note_mn}</Text> : null}
        </View>
      ))}
    </>
  );
}
