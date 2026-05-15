import type { ExamQuestion } from '../../lib/api/exams';

export function mockExamPromptText(q: ExamQuestion): string {
  /** Listening: scenario + Japanese audio script. Reading: Japanese passage + romaji reading aid. */
  if (q.section === 'listening') {
    const lines = [q.scenario_mn, q.listen_jp].filter((x) => typeof x === 'string' && x.trim() !== '');
    return lines.join('\n').trim();
  }
  return `${q.question_jp ?? ''}\n${q.question_romaji ?? ''}`.trim();
}

export function mockExamOptionStrings(q: ExamQuestion): string[] {
  return (Array.isArray(q.options) ? q.options : []).map((x) => String(x));
}
