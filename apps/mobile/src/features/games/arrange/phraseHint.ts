import type { WordWithProgress } from '../../../lib/types';

export function phraseMeaningHint(phrase: string, words: WordWithProgress[]): string | null {
  for (const w of words) {
    if (w.hanzi === phrase) return w.meaning_mn ?? null;
    if (w.example_zh?.includes(phrase)) return w.meaning_mn ?? null;
  }
  return null;
}
