import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MandarinSpeechCard } from '../../../components/practice/MandarinSpeechCard';
import { MockExamAudioButton } from '../MockExamAudioButton';
import { colors, radius, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';
import type { LessonShadowTarget } from './buildLessonShadowTargets';
import { LessonTrainingSectionShell } from './LessonTrainingSectionShell';

export function LessonTrainingShadowSection({ targets }: { targets: LessonShadowTarget[] }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(targets[0]?.key ?? null);
  const sel = targets.find((t) => t.key === selectedKey);

  if (!targets.length) {
    return (
      <LessonTrainingSectionShell title={mn.study.lessonTrainingSecShadow}>
        <Text style={styles.empty}>{mn.study.lessonTrainingShadowEmpty}</Text>
      </LessonTrainingSectionShell>
    );
  }

  return (
    <LessonTrainingSectionShell title={mn.study.lessonTrainingSecShadow}>
      <Text style={styles.hint}>{mn.study.lessonTrainingShadowHint}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
        keyboardShouldPersistTaps="handled"
      >
        {targets.map((t) => {
          const on = t.key === selectedKey;
          return (
            <Pressable
              key={t.key}
              onPress={() => setSelectedKey(t.key)}
              style={[styles.pill, on && styles.pillOn]}
            >
              <Text style={[styles.pillTitle, on && styles.pillTitleOn]} numberOfLines={1}>
                {t.dialogueTitle}
              </Text>
              <Text style={[styles.pillCn, on && styles.pillCnOn]} numberOfLines={2}>
                {t.hanzi}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {sel ? (
        <View style={styles.active}>
          <Text style={styles.mn}>{sel.meaningMn}</Text>
          {sel.audioUrl ? <MockExamAudioButton uri={sel.audioUrl} /> : null}
          <MandarinSpeechCard key={`lt-sh-${sel.key}`} word={sel.word} onEvaluated={() => {}} />
        </View>
      ) : null}
    </LessonTrainingSectionShell>
  );
}

const styles = StyleSheet.create({
  hint: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.sm },
  empty: { ...typography.body.md, color: colors.text.secondary },
  pillRow: { gap: spacing.sm, paddingBottom: spacing.sm },
  pill: {
    maxWidth: 200,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bg.primary,
    borderWidth: 2,
    borderColor: colors.border,
  },
  pillOn: { borderColor: colors.brand.primary, backgroundColor: `${colors.brand.primary}18` },
  pillTitle: { ...typography.body.sm, fontWeight: '800', color: colors.text.secondary },
  pillTitleOn: { color: colors.brand.primaryDark },
  pillCn: { ...typography.body.sm, color: colors.text.primary, marginTop: 4, fontWeight: '700' },
  pillCnOn: { color: colors.text.primary },
  active: { marginTop: spacing.md, gap: spacing.sm },
  mn: { ...typography.body.md, color: colors.text.secondary, lineHeight: 22, fontWeight: '600' },
});
