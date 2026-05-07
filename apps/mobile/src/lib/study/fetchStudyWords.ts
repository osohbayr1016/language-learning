import { api } from '../api';
import type { Word, WordWithProgress } from '../types';

function asProgress(rows: Word[] | undefined): WordWithProgress[] {
  return (rows ?? []).map((w) => ({
    ...w,
    ease_factor: null,
    interval: null,
    repetitions: null,
    next_review: null,
    last_reviewed: null,
  }));
}

/** Auth queue first; if empty, public word list so Study modes always have content when DB has words. */
export async function fetchStudyWords(
  token: string | null,
  limit: number
): Promise<WordWithProgress[]> {
  if (token) {
    try {
      const res = await api.words.due(token, limit);
      const due = res.data ?? [];
      if (due.length > 0) return due.slice(0, limit);
    } catch {
      /* fall through to public list */
    }
  }
  const pub = await api.words.list({ limit: Math.max(limit, 30), hsk: 1 });
  let rows = asProgress(pub.data);
  if (rows.length === 0) {
    const any = await api.words.list({ limit: Math.max(limit, 30) });
    rows = asProgress(any.data);
  }
  return rows.slice(0, limit);
}
