import type { QRow } from './examTypes';

export function omitExamQuestionAnswer(q: QRow, apiOrigin: string): Record<string, unknown> {
  let opts: unknown[] = [];
  if (typeof q.options === 'string' && q.options) {
    try {
      opts = JSON.parse(q.options) as unknown[];
    } catch {
      opts = [];
    }
  }
  const L = q.section === 'listening';
  const ak = q.audio_key?.trim();
  const audio_url =
    ak && ak.startsWith('exams/')
      ? `${apiOrigin}/api/exams/file/${encodeURIComponent(ak)}`
      : undefined;
  return {
    id: q.id,
    section: q.section,
    part_num: q.part_num ?? 1,
    question_num: q.question_num ?? 0,
    question_type: q.question_type,
    ...(L
      ? {
          scenario_mn: q.question_text,
          listen_zh: q.audio_text ?? '',
        }
      : {
          question_zh: q.question_text,
          question_pinyin: q.question_pinyin,
        }),
    options: opts,
    order_num: q.order_num ?? 0,
    ...(audio_url ? { audio_url } : {}),
  };
}
