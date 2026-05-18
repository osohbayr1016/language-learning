import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ImportedLessonContent } from '../../../lib/types';
import { colors, radius, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';
import { kanjiRows, phraseRows } from '../../lessons/importedVocabRows';

export function LessonTrainingStatsRow({ imp }: { imp: ImportedLessonContent | null | undefined }) {
  if (!imp) {
    return (
      <View style={styles.row}>
        <Text style={styles.chipMuted}>{mn.study.lessonTrainingNoImport}</Text>
      </View>
    );
  }

  const kanji = kanjiRows(imp.vocab).length;
  const phrases = phraseRows(imp.vocab).length;
  const radicals = imp.radicals?.length ?? 0;
  const dialogues = imp.dialogues.filter((d) => (d.lines?.length ?? 0) > 0 || Boolean(d.text_cn?.trim())).length;

  return (
    <View style={styles.row}>
      <StatChip label={mn.study.lessonTrainingStatKanji} value={kanji} />
      <StatChip label={mn.study.lessonTrainingStatPhrases} value={phrases} />
      <StatChip label={mn.study.lessonTrainingStatRadicals} value={radicals} />
      <StatChip label={mn.study.lessonTrainingStatDialogues} value={dialogues} />
    </View>
  );
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipVal}>{value}</Text>
      <Text style={styles.chipLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    minWidth: 72,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
  },
  chipVal: { fontSize: 18, fontWeight: '900', color: '#fff' },
  chipLbl: { ...typography.body.sm, fontWeight: '700', color: 'rgba(255,255,255,0.92)', marginTop: 2 },
  chipMuted: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '600' },
});
