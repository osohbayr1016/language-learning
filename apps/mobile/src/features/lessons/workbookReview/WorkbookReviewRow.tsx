import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MockExamAudioButton } from '../../study/MockExamAudioButton';
import { mn } from '../../../i18n/mn';
import { colors, radius, spacing, typography } from '../../../theme';
import type { WorkbookReviewRow as RowType } from './collectWorkbookReviewRows';
import { formatWorkbookAnswerDisplay } from './formatWorkbookAnswer';

export function WorkbookReviewRow({ row }: { row: RowType }) {
  const { item, sectionTitle, bank } = row;
  const ans = formatWorkbookAnswerDisplay(item.answer, {
    trueAnswer: mn.lesson.workbookReview.trueAnswer,
    falseAnswer: mn.lesson.workbookReview.falseAnswer,
  });

  return (
    <View style={styles.card}>
      {sectionTitle ? <Text style={styles.sec}>{sectionTitle}</Text> : null}
      {bank?.length ? <Text style={styles.bank}>Үгс: {bank.join(' / ')}</Text> : null}
      {item.parts?.length ? (
        <Text style={styles.bank}>{item.parts.join(' / ')}</Text>
      ) : null}
      {item.audio_url ? (
        <View style={styles.audioBlock}>
          <Text style={styles.audioLbl}>{mn.lesson.workbookReview.clipAudio}</Text>
          <MockExamAudioButton uri={item.audio_url} />
        </View>
      ) : null}
      {item.full_track_url ? (
        <View style={styles.audioBlock}>
          <Text style={styles.audioLbl}>{mn.lesson.workbookReview.fullAudio}</Text>
          <MockExamAudioButton uri={item.full_track_url} />
        </View>
      ) : null}
      <Text style={styles.q}>{item.q}</Text>
      <Text style={styles.ansHead}>{mn.lesson.workbookReview.answerHeading}</Text>
      <Text style={styles.ansBody}>{ans ?? mn.lesson.workbookReview.noAnswer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg.secondary,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sec: { ...typography.body.sm, fontWeight: '800', color: colors.text.muted },
  bank: { ...typography.body.sm, color: colors.brand.secondary, lineHeight: 20 },
  audioBlock: { gap: spacing.xs },
  audioLbl: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '700' },
  q: { ...typography.heading.sm, color: colors.text.primary, lineHeight: 28, marginTop: spacing.xs },
  ansHead: { ...typography.body.sm, fontWeight: '800', color: colors.text.secondary, marginTop: spacing.sm },
  ansBody: { ...typography.body.md, color: colors.text.primary, fontWeight: '700', lineHeight: 24 },
});
