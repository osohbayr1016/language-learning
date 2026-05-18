import type { ImportedLessonContent, Word } from '../../../lib/types';

const CJK = /[\u4e00-\u9fff]/;
const MAX_LEN = 28;
const MIN_LEN = 1;

function pushNorm(set: Set<string>, s: string) {
  const t = s.replace(/\s+/g, '').trim();
  if (t.length < MIN_LEN || t.length > MAX_LEN) return;
  let has = false;
  for (const ch of t) {
    if (CJK.test(ch)) {
      has = true;
      break;
    }
  }
  if (has) set.add(t);
}

/** Phrases for arrange game: JSON lesson content + linked words fallback. */
export function collectArrangePhrases(
  imported: ImportedLessonContent | null | undefined,
  words: Word[]
): string[] {
  const set = new Set<string>();

  if (imported) {
    for (const r of imported.radicals ?? []) {
      if (r.char?.trim()) pushNorm(set, r.char.trim());
    }
    for (const v of imported.vocab ?? []) {
      if (v.hanzi?.trim()) pushNorm(set, v.hanzi.trim());
    }
    for (const d of imported.dialogues ?? []) {
      if (d.text_cn?.trim()) pushNorm(set, d.text_cn.trim());
      for (const ln of d.lines ?? []) {
        if (ln.cn?.trim()) pushNorm(set, ln.cn.trim());
      }
    }
  }

  for (const w of words) {
    if (w.hanzi?.trim()) pushNorm(set, w.hanzi.trim());
    if (w.example_zh?.trim()) pushNorm(set, w.example_zh.trim());
  }

  const list = [...set];
  return list.sort(() => Math.random() - 0.5);
}
