export type WorkbookAnswerLabels = {
  trueAnswer: string;
  falseAnswer: string;
};

/** Display string for workbook answer, or null when nothing meaningful to show. */
export function formatWorkbookAnswerDisplay(
  answer: string | boolean | null | undefined,
  labels: WorkbookAnswerLabels
): string | null {
  if (answer === null || answer === undefined) return null;
  if (typeof answer === 'boolean') return answer ? labels.trueAnswer : labels.falseAnswer;
  const s = String(answer).trim();
  return s === '' ? null : s;
}
