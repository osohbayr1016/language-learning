import type { ExamQuestion } from '../../lib/api/exams';

export function mockExamPromptText(q: ExamQuestion): string {
  /** Сонсох: дүрэм нь scenario_mn, овстой оролт нь listen_zh; 1–20 дугаарт listen_zh хоосон байж болно. */
  if (q.section === 'listening') {
    const lines = [q.scenario_mn, q.listen_zh].filter((x) => typeof x === 'string' && x.trim() !== '');
    return lines.join('\n').trim();
  }
  return `${q.question_zh ?? ''}\n${q.question_pinyin ?? ''}`.trim();
}

export function mockExamOptionStrings(q: ExamQuestion): string[] {
  return (Array.isArray(q.options) ? q.options : []).map((x) => String(x));
}
