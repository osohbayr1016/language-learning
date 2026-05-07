import { api } from '../api';
import { getApiBase } from '../api/client';
import { DEFAULT_PRODUCTION_API } from '../api/publicUrl';
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

function uniqueBases(): string[] {
  const a = getApiBase().replace(/\/+$/, '');
  const b = DEFAULT_PRODUCTION_API.replace(/\/+$/, '');
  return a === b ? [a] : [a, b];
}

/** Вэб дээр request() эсвэл буруу суурь → хоосон; шууд fetch нь илүү найдвартай. */
async function fetchPublicWordsViaFetch(limit: number, hsk?: number): Promise<Word[]> {
  const n = Math.max(limit, 30);
  const sp = new URLSearchParams({ limit: String(n) });
  if (hsk != null) sp.set('hsk', String(hsk));

  for (const base of uniqueBases()) {
    const url = `${base}/api/words?${sp.toString()}`;
    try {
      const res = await fetch(url, { method: 'GET' });
      const text = await res.text();
      if (!res.ok) continue;
      const j = JSON.parse(text) as { data?: Word[] };
      if (Array.isArray(j.data) && j.data.length > 0) return j.data;
    } catch {
      /* try next base */
    }
  }
  return [];
}

/** Auth queue first; дараа нь public list; эцэст нь шууд fetch fallback (вэб SPA/суурь алдааг давах). */
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
      /* fall through */
    }
  }

  let rows: WordWithProgress[] = [];
  try {
    const pub = await api.words.list({ limit: Math.max(limit, 30), hsk: 1 });
    rows = asProgress(pub.data);
  } catch {
    rows = [];
  }
  if (rows.length === 0) {
    try {
      const any = await api.words.list({ limit: Math.max(limit, 30) });
      rows = asProgress(any.data);
    } catch {
      rows = [];
    }
  }
  if (rows.length === 0) {
    let raw = await fetchPublicWordsViaFetch(limit, 1);
    if (raw.length === 0) raw = await fetchPublicWordsViaFetch(limit, undefined);
    rows = asProgress(raw);
  }

  return rows.slice(0, limit);
}
