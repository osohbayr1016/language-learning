import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Exercise } from '../types';
import type { WordWithProgress } from '../../../lib/types';
import { colors, radius, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';
import {
  DialoguePane,
  EasyTextsPane,
  NotesPane,
  SummaryPane,
  VocabPane,
} from './importedSectionPanes';
import { kanjiRows, phraseRows } from '../importedVocabRows';

type Ex = Extract<Exercise, { kind: 'imported-section' }>;

export function ImportedSectionCard({
  exercise,
  lessonWords,
  disabled,
  onAnswer,
}: {
  exercise: Ex;
  lessonWords?: WordWithProgress[];
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
}) {
  const c = exercise.content;
  const body = (() => {
    switch (exercise.section) {
      case 'summary':
        return <SummaryPane content={c} />;
      case 'kanjis':
        return <VocabPane rows={kanjiRows(c.vocab)} lessonWords={lessonWords} />;
      case 'phrases':
        return <VocabPane rows={phraseRows(c.vocab)} lessonWords={lessonWords} />;
      case 'easy-texts':
        return <EasyTextsPane content={c} />;
      case 'dialogue':
        return <DialoguePane content={c} />;
      case 'grammar':
        return <NotesPane title="Grammar" rows={c.grammar} />;
      case 'slang':
        return <NotesPane title="Slang" rows={c.slang} />;
    }
  })();

  return (
    <View style={styles.wrap}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        {body}
      </ScrollView>
      <Pressable
        disabled={disabled}
        style={[styles.btn, disabled && styles.disabled]}
        onPress={() => onAnswer(true)}
      >
        <Text style={styles.btnText}>{mn.lesson.gotIt}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 0, width: '100%' },
  scroll: { flex: 1, minHeight: 0 },
  scrollContent: { paddingBottom: spacing.sm, flexGrow: 0 },
  btn: {
    marginTop: spacing.md,
    flexShrink: 0,
    borderRadius: radius.md,
    backgroundColor: colors.brand.primary,
    padding: spacing.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.5 },
  btnText: { ...typography.body.md, color: '#fff', fontWeight: '800' },
});
