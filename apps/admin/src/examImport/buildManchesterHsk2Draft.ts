import type { ExamDraftQuestion } from './examDraftTypes';
import { assertFullAnswerKey, parseHsk2AnswerSheet } from './parseHsk2Answers';
import { buildListeningDraft } from './hsk2ListeningDraft';
import { buildReadingDraft } from './hsk2ReadingDraft';

export type { ExamDraftQuestion } from './examDraftTypes';
export { assertFullAnswerKey, parseHsk2AnswerSheet } from './parseHsk2Answers';

/** Manchester / Confucius HSK二级 full-paper shaped PDFs (Chinese text extraction). */
export function buildManchesterHsk2Draft(examText: string, answerSheetText: string): ExamDraftQuestion[] {
  const answers = parseHsk2AnswerSheet(answerSheetText);
  assertFullAnswerKey(answers);
  const Li = buildListeningDraft(examText, answers);
  return Li.concat(buildReadingDraft(examText, answers, Li.length));
}
