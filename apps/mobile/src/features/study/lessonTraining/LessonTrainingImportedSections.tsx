import React from 'react';
import type { LessonDetail } from '../../../lib/types';
import { mn } from '../../../i18n/mn';
import {
  DialoguePane,
  EasyTextsPane,
  NotesPane,
  RadicalsPane,
  SummaryPane,
} from '../../lessons/importedSections/importedSectionPanes';
import { VocabPane } from '../../lessons/importedSections/VocabPane';
import { kanjiRows, phraseRows } from '../../lessons/importedVocabRows';
import { LessonTrainingSectionShell } from './LessonTrainingSectionShell';

export function LessonTrainingImportedSections({ detail }: { detail: LessonDetail }) {
  const imp = detail.imported_content;
  if (!imp) return null;

  const kanji = kanjiRows(imp.vocab);
  const phrases = phraseRows(imp.vocab);
  const hasEasy = imp.dialogues.some((d) => Boolean(d.text_cn?.trim()));
  const hasDialogueLines = imp.dialogues.some((d) => (d.lines?.length ?? 0) > 0);
  const mistakes = imp.common_mistakes ?? [];

  return (
    <>
      {imp.summary?.trim() ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecSummary}>
          <SummaryPane content={imp} />
        </LessonTrainingSectionShell>
      ) : null}

      {(imp.radicals?.length ?? 0) > 0 ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecRadicals}>
          <RadicalsPane content={imp} />
        </LessonTrainingSectionShell>
      ) : null}

      {kanji.length > 0 ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecKanji}>
          <VocabPane rows={kanji} lessonWords={detail.words} />
        </LessonTrainingSectionShell>
      ) : null}

      {phrases.length > 0 ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecPhrases}>
          <VocabPane rows={phrases} lessonWords={detail.words} />
        </LessonTrainingSectionShell>
      ) : null}

      {hasEasy ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecEasy}>
          <EasyTextsPane content={imp} />
        </LessonTrainingSectionShell>
      ) : null}

      {hasDialogueLines ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecDialogue}>
          <DialoguePane content={imp} />
        </LessonTrainingSectionShell>
      ) : null}

      {imp.grammar.length > 0 ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecGrammar}>
          <NotesPane title="Grammar" rows={imp.grammar} />
        </LessonTrainingSectionShell>
      ) : null}

      {imp.slang.length > 0 ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecSlang}>
          <NotesPane title="Slang" rows={imp.slang} />
        </LessonTrainingSectionShell>
      ) : null}

      {mistakes.length > 0 ? (
        <LessonTrainingSectionShell title={mn.study.lessonTrainingSecMistakes}>
          <NotesPane title={mn.study.lessonTrainingSecMistakes} rows={mistakes} />
        </LessonTrainingSectionShell>
      ) : null}
    </>
  );
}
