import type { ExamQuestion } from '../../lib/api/exams';

export function mockExamPromptText(q: ExamQuestion): string {
  if (q.listen_zh) return `${q.scenario_mn ?? ''}\n${q.listen_zh}`.trim();
  return `${q.question_zh ?? ''}\n${q.question_pinyin ?? ''}`.trim();
}

export function mockExamOptionStrings(q: ExamQuestion): string[] {
  return (Array.isArray(q.options) ? q.options : []).map((x) => String(x));
}
