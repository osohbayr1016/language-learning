import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Word } from '../../../lib/types';
import { MandarinSpeechCard } from '../../../components/practice/MandarinSpeechCard';
import { Button } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';
import { LessonTrainingSectionShell } from './LessonTrainingSectionShell';

export function LessonTrainingSpeakSection({ words }: { words: Word[] }) {
  const [idx, setIdx] = useState(0);
  const [roundDone, setRoundDone] = useState(false);
  const pool = useMemo(() => words.filter((w) => (w.hanzi ?? '').trim().length > 0), [words]);
  const current = pool[idx] ?? null;

  if (!pool.length) {
    return (
      <LessonTrainingSectionShell title={mn.study.lessonTrainingSecSpeak}>
        <Text style={styles.empty}>{mn.study.lessonTrainingSpeakEmpty}</Text>
      </LessonTrainingSectionShell>
    );
  }

  const next = () => {
    setRoundDone(false);
    setIdx((i) => (i + 1 >= pool.length ? 0 : i + 1));
  };

  return (
    <LessonTrainingSectionShell title={mn.study.lessonTrainingSecSpeak}>
      <Text style={styles.hint}>{mn.study.lessonTrainingSpeakHint}</Text>
      <Text style={styles.counter}>
        {mn.study.lessonTrainingSpeakProgress.replace('{n}', String(idx + 1)).replace('{t}', String(pool.length))}
      </Text>
      {current ? (
        <MandarinSpeechCard
          key={`lt-sp-${current.id}-${idx}`}
          word={current}
          onEvaluated={() => setRoundDone(true)}
        />
      ) : null}
      {roundDone ? (
        <View style={styles.footer}>
          <Button label={mn.study.next} onPress={next} />
        </View>
      ) : null}
    </LessonTrainingSectionShell>
  );
}

const styles = StyleSheet.create({
  hint: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.sm },
  counter: { ...typography.body.sm, fontWeight: '800', color: colors.text.primary, marginBottom: spacing.sm },
  empty: { ...typography.body.md, color: colors.text.secondary },
  footer: { marginTop: spacing.md },
});
